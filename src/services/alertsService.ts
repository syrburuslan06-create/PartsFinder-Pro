import { supabase } from '../lib/supabase';
import { GeminiSearchResult, Alert } from '../types';

export const AlertsService = {
  async fetchAlerts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
    return data as Alert[];
  },

  async markAsRead(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
    return true;
  },

  async deleteAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('Error deleting alert:', error);
      return false;
    }
    return true;
  },

  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all alerts as read:', error);
      return false;
    }
    return true;
  },

  async deleteAllAlerts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting all alerts:', error);
      return false;
    }
    return true;
  },

  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'is_read'>) {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return null;
    }
    return data as Alert;
  },

  async processSearchResults(results: GeminiSearchResult[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch saved parts to compare
    const { data: savedParts, error: savedError } = await supabase
      .from('saved_parts')
      .select('*')
      .eq('mechanic_id', user.id);

    if (savedError || !savedParts) return;

    for (const result of results) {
      const savedPart = savedParts.find(p => p.part_number === result.partNumber);
      if (savedPart) {
        // 1. Check Price Drop
        const currentPrice = parseFloat(result.price.replace(/[^0-9.]/g, ''));
        const savedPrice = parseFloat(savedPart.price);

        if (!isNaN(currentPrice) && !isNaN(savedPrice) && currentPrice < savedPrice) {
          await this.createAlert({
            user_id: user.id,
            type: 'price_drop',
            title: `Price Drop: ${result.partName}`,
            description: `The price for ${result.partName} (${result.partNumber}) has dropped from $${savedPrice} to $${currentPrice} at ${result.supplier}.`,
            metadata: {
              partNumber: result.partNumber,
              oldPrice: savedPrice,
              newPrice: currentPrice,
              supplier: result.supplier,
              url: result.sourceUrl
            }
          });

          // Update saved part price to the new lower price
          await supabase
            .from('saved_parts')
            .update({ price: currentPrice })
            .eq('id', savedPart.id);
        }

        // 2. Check New Part Available (New Supplier)
        const knownSuppliers = savedPart.suppliers || [];
        if (!knownSuppliers.includes(result.supplier)) {
          await this.createAlert({
            user_id: user.id,
            type: 'new_part',
            title: `New Supplier: ${result.partName}`,
            description: `${result.supplier} now carries ${result.partName} (${result.partNumber}) for ${result.price}.`,
            metadata: {
              partNumber: result.partNumber,
              supplier: result.supplier,
              price: result.price,
              url: result.sourceUrl
            }
          });

          // Add to known suppliers
          await supabase
            .from('saved_parts')
            .update({ suppliers: [...knownSuppliers, result.supplier] })
            .eq('id', savedPart.id);
        }
      }
    }
  },

  async checkMaintenance() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', user.id);

    if (invError || !inventory) return;

    const today = new Date();
    for (const vehicle of inventory) {
      if (vehicle.last_service) {
        const lastService = new Date(vehicle.last_service);
        const diffTime = Math.abs(today.getTime() - lastService.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Alert if last service was more than 180 days ago (approx 6 months)
        if (diffDays > 180) {
          // Check if we already have an active maintenance alert for this vehicle
          const { data: existingAlerts } = await supabase
            .from('alerts')
            .select('id')
            .eq('user_id', user.id)
            .eq('type', 'maintenance')
            .eq('is_read', false)
            .contains('metadata', { vehicleId: vehicle.id });

          if (!existingAlerts || existingAlerts.length === 0) {
            await this.createAlert({
              user_id: user.id,
              type: 'maintenance',
              title: `Maintenance Due: ${vehicle.name}`,
              description: `${vehicle.year} ${vehicle.make} ${vehicle.model} is due for service. Last service was ${diffDays} days ago.`,
              metadata: {
                vehicleId: vehicle.id,
                lastService: vehicle.last_service,
                daysSince: diffDays
              }
            });
          }
        }
      }
    }
  }
};
