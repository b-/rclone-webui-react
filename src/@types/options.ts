interface DLNA {
  ListenAddr: string;
  Friendlyname: string;
  LogTrace: boolean;
}

interface Filter {
  DeleteExcluded: boolean;
  FilterRule: any;
  FilterFrom: any;
  ExcludeRule: any;
  ExcludeFrom: any;
  ExcludeFile: any;
  IncludeRule: any;
  IncludeFrom: any;
  FilesFrom: any;
  FilesFromRaw: any;
  MinAge: number;
  MaxAge: number;
  MinSize: number;
  MaxSize: number;
  IgnoreCase: boolean;
}

interface FTP {
  ListenAddr: string;
  PublicIP: string;
  PassivePorts: string;
  BasicUser: string;
  BasicPass: string;
  TLSCert: string;
  TLSKey: string;
}

interface HTTP {
  ListenAddr: string;
  BaseURL: string;
  ServerReadTimeout: number;
  ServerWriteTimeout: number;
  MaxHeaderBytes: number;
  SslCert: string;
  SslKey: string;
  ClientCA: string;
  HtPasswd: string;
  Realm: string;
  BasicUser: string;
  BasicPass: string;
  Template: string;
}

interface Log {
  File: string;
  Format: string;
  UseSyslog: boolean;
  SyslogFacility: string;
  LogSystemdSupport: boolean;
}

interface Main {
  LogLevel: number;
  StatsLogLevel: number;
  UseJSONLog: boolean;
  DryRun: boolean;
  Interactive: boolean;
  CheckSum: boolean;
  SizeOnly: boolean;
  IgnoreTimes: boolean;
  IgnoreExisting: boolean;
  IgnoreErrors: boolean;
  ModifyWindow: number;
  Checkers: number;
  Transfers: number;
  ConnectTimeout: number;
  Timeout: number;
  ExpectContinueTimeout: number;
  Dump: number;
  InsecureSkipVerify: boolean;
  DeleteMode: number;
  MaxDelete: number;
  TrackRenames: boolean;
  TrackRenamesStrategy: string;
  LowLevelRetries: number;
  UpdateOlder: boolean;
  NoGzip: boolean;
  MaxDepth: number;
  IgnoreSize: boolean;
  IgnoreChecksum: boolean;
  IgnoreCaseSync: boolean;
  NoTraverse: boolean;
  CheckFirst: boolean;
  NoCheckDest: boolean;
  NoUnicodeNormalization: boolean;
  NoUpdateModTime: boolean;
  DataRateUnit: string;
  CompareDest: any;
  CopyDest: any;
  BackupDir: string;
  Suffix: string;
  SuffixKeepExtension: boolean;
  UseListR: boolean;
  BufferSize: number;
  BwLimit: string;
  BwLimitFile: string;
  TPSLimit: number;
  TPSLimitBurst: number;
  BindAddr: string;
  DisableFeatures: any;
  UserAgent: string;
  Immutable: boolean;
  AutoConfirm: boolean;
  StreamingUploadCutoff: number;
  StatsFileNameLength: number;
  AskPassword: boolean;
  PasswordCommand: any;
  UseServerModTime: boolean;
  MaxTransfer: number;
  MaxDuration: number;
  CutoffMode: number;
  MaxBacklog: number;
  MaxStatsGroups: number;
  StatsOneLine: boolean;
  StatsOneLineDate: boolean;
  StatsOneLineDateFormat: string;
  ErrorOnNoTransfer: boolean;
  Progress: boolean;
  ProgressTerminalTitle: boolean;
  Cookie: boolean;
  UseMmap: boolean;
  CaCert: string;
  ClientCert: string;
  ClientKey: string;
  MultiThreadCutoff: number;
  MultiThreadStreams: number;
  MultiThreadSet: boolean;
  OrderBy: string;
  UploadHeaders: any;
  DownloadHeaders: any;
  Headers: any;
  MetadataSet: any;
  RefreshTimes: boolean;
  NoConsole: boolean;
  TrafficClass: number;
  FsCacheExpireDuration: number;
  FsCacheExpireInterval: number;
  DisableHTTP2: boolean;
  HumanReadable: boolean;
  KvLockTime: number;
  DisableHTTPKeepAlives: boolean;
  Metadata: boolean;
}

interface Mount {
  DebugFUSE: boolean;
  AllowNonEmpty: boolean;
  AllowRoot: boolean;
  AllowOther: boolean;
  DefaultPermissions: boolean;
  WritebackCache: boolean;
  Daemon: boolean;
  DaemonWait: number;
  MaxReadAhead: number;
  ExtraOptions: any[];
  ExtraFlags: any[];
  AttrTimeout: number;
  DeviceName: string;
  VolumeName: string;
  NoAppleDouble: boolean;
  NoAppleXattr: boolean;
  DaemonTimeout: number;
  AsyncRead: boolean;
  NetworkMode: boolean;
}

interface RC {
  HTTPOptions: {
    ListenAddr: string;
    BaseURL: string;
    ServerReadTimeout: number;
    ServerWriteTimeout: number;
    MaxHeaderBytes: number;
    SslCert: string;
    SslKey: string;
    ClientCA: string;
    HtPasswd: string;
    Realm: string;
    BasicUser: string;
    BasicPass: string;
    Template: string;
  };
  Enabled: boolean;
  Serve: boolean;
  Files: string;
  NoAuth: boolean;
  WebUI: boolean;
  WebGUIUpdate: boolean;
  WebGUIForceUpdate: boolean;
  WebGUINoOpenBrowser: boolean;
  WebGUIFetchURL: string;
  AccessControlAllowOrigin: string;
  EnableMetrics: boolean;
  JobExpireDuration: number;
  JobExpireInterval: number;
}

interface RCHTTP {
  ListenAddr: string;
  BaseURL: string;
  ServerReadTimeout: number;
  ServerWriteTimeout: number;
  MaxHeaderBytes: number;
  SslCert: string;
  SslKey: string;
  ClientCA: string;
  HtPasswd: string;
  Realm: string;
  BasicUser: string;
  BasicPass: string;
  Template: string;
}

interface SFTP {
  ListenAddr: string;
  HostKeys: any;
  AuthorizedKeys: string;
  User: string;
  Pass: string;
  NoAuth: boolean;
  Stdio: boolean;
}

interface VFS {
  NoSeek: boolean;
  NoChecksum: boolean;
  ReadOnly: boolean;
  NoModTime: boolean;
  DirCacheTime: number;
  PollInterval: number;
  Umask: number;
  UID: number;
  GID: number;
  DirPerms: number;
  FilePerms: number;
  ChunkSize: number;
  ChunkSizeLimit: number;
  CacheMode: number;
  CacheMaxAge: number;
  CacheMaxSize: number;
  CachePollInterval: number;
  CaseInsensitive: boolean;
  WriteWait: number;
  ReadWait: number;
  WriteBack: number;
  ReadAhead: number;
  UsedIsSize: boolean;
  FastFingerprint: boolean;
  DiskSpaceTotalSize: number;
}

type OptionsType =
  | DLNA
  | Filter
  | FTP
  | HTTP
  | Log
  | Main
  | Mount
  | RC
  | RCHTTP
  | SFTP
  | VFS;

export interface Options {
  [key: string]: OptionsType;
}
