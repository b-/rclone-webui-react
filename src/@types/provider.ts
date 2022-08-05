export interface Provider {
  Name: string;
  Description: string;
  Prefix: string;
  Options: Options;
  CommandHelp: CommandHelp[];
  Aliases: null;
  Hide: boolean;
  MetadataInfo: null;
}

export interface Options {
  Name: string;
  Help: string;
  Provider: string;
  Default: string;
  Value: boolean;
  ShortOpt: string;
  Hide: number;
  Required: boolean;
  IsPassword: boolean;
  NoPrefix: boolean;
  Advanced: boolean;
  Exclusive: boolean;
  DefaultStr: string;
  ValueStr: string;
  Type: string;
}

export interface CommandHelp {
  Name: string;
  Short: string;
  Long: string;
  Opts: {
    [key: string]: string;
  };
}
