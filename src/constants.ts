export interface PartCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
    parts: string[];
  }[];
}

export const PART_CATEGORIES: PartCategory[] = [
  {
    id: 'engine',
    name: 'Engine & Drivetrain',
    icon: 'Cpu',
    subcategories: [
      { id: 'internal', name: 'Internal Components', parts: ['Pistons', 'Crankshaft', 'Camshaft', 'Valves', 'Gaskets'] },
      { id: 'cooling', name: 'Cooling System', parts: ['Radiator', 'Water Pump', 'Thermostat', 'Coolant Hoses'] },
      { id: 'fuel', name: 'Fuel System', parts: ['Fuel Injectors', 'Fuel Pump', 'Fuel Filter', 'Throttle Body'] },
    ]
  },
  {
    id: 'transmission',
    name: 'Transmission',
    icon: 'Zap',
    subcategories: [
      { id: 'clutch', name: 'Clutch & Flywheel', parts: ['Clutch Kit', 'Flywheel', 'Slave Cylinder'] },
      { id: 'automatic', name: 'Automatic Trans', parts: ['Torque Converter', 'Solenoids', 'Transmission Filter'] },
      { id: 'drive', name: 'Driveline', parts: ['CV Axle', 'Drive Shaft', 'Differential', 'Wheel Bearings'] },
    ]
  },
  {
    id: 'suspension',
    name: 'Suspension & Steering',
    icon: 'Car',
    subcategories: [
      { id: 'shocks', name: 'Shocks & Struts', parts: ['Shock Absorbers', 'Strut Assembly', 'Coil Springs'] },
      { id: 'steering', name: 'Steering', parts: ['Rack and Pinion', 'Power Steering Pump', 'Tie Rod Ends'] },
      { id: 'control', name: 'Control Arms', parts: ['Upper Control Arm', 'Lower Control Arm', 'Ball Joints'] },
    ]
  },
  {
    id: 'braking',
    name: 'Braking System',
    icon: 'Shield',
    subcategories: [
      { id: 'pads', name: 'Pads & Rotors', parts: ['Brake Pads', 'Brake Rotors', 'Brake Drums', 'Brake Shoes'] },
      { id: 'hydraulics', name: 'Hydraulics', parts: ['Master Cylinder', 'Brake Caliper', 'Brake Lines', 'ABS Module'] },
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical & Lighting',
    icon: 'Zap',
    subcategories: [
      { id: 'ignition', name: 'Ignition', parts: ['Spark Plugs', 'Ignition Coils', 'Starter Motor', 'Alternator'] },
      { id: 'lighting', name: 'Lighting', parts: ['Headlight Assembly', 'Tail Light', 'Turn Signals', 'Fog Lights'] },
      { id: 'sensors', name: 'Sensors', parts: ['O2 Sensor', 'MAF Sensor', 'Crank Sensor', 'ABS Sensor'] },
    ]
  }
];
