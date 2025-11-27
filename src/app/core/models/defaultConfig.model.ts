export interface ConfigurationSetting {
  id: number;
  name: string;
  value: string | number;
  description: string;
  createdBy: number;
  createdDate: Date;
  lastChangedBy: number;
  lastChangedDate: Date;
}

