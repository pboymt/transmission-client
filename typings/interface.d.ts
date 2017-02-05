export interface TransmissionOptions {
    url?: string;
    host?: string;
    port?: number;
    ssl?: boolean;
    key?: any;
    username?: string;
    password?: string;
}
export interface FileStat {
    bytesCompleted: number;
    priority: number;
    wanted: boolean;
}
export interface File {
    bytesCompleted: number;
    length: number;
    name: string;
}
export interface Peer {
    address: string;
    clientIsChoked: boolean;
    clientIsInterested: boolean;
    clientName: string;
    flagStr: string;
    isDownloadingFrom: boolean;
    isEncrypted: boolean;
    isIncoming: boolean;
    isUTP: boolean;
    isUploadingTo: boolean;
    peerIsChoked: boolean;
    peerIsInterested: boolean;
    port: number;
    progress: number;
    rateToClient: number;
    rateToPeer: number;
}
export interface TrackerStat {
    announce: string;
    announceState: number;
    downloadCount: number;
    hasAnnounced: boolean;
    hasScraped: boolean;
    host: string;
    id: number;
    isBackup: boolean;
    lastAnnouncePeerCount: number;
    lastAnnounceResult: string;
    lastAnnounceStartTime: number;
    lastAnnounceSucceeded: boolean;
    lastAnnounceTime: number;
    lastAnnounceTimedOut: boolean;
    lastScrapeResult: string;
    lastScrapeStartTime: number;
    lastScrapeSucceeded: boolean;
    lastScrapeTime: number;
    lastScrapeTimedOut: number;
    leecherCount: number;
    nextAnnounceTime: number;
    nextScrapeTime: number;
    scrape: string;
    scrapeState: number;
    seederCount: number;
    tier: number;
}
export interface Tracker {
    announce: string;
    id: number;
    scrape: string;
    tier: number;
}
export interface Torrent {
    activityDate: number;
    addedDate: number;
    bandwidthPriority: number;
    comment: string;
    corruptEver: number;
    creator: string;
    dateCreated: number;
    desiredAvailable: number;
    doneDate: number;
    downloadDir: string;
    downloadLimit: number;
    downloadLimited: boolean;
    downloadedEver: number;
    error: number;
    errorString: string;
    eta: number;
    fileStats: FileStat[];
    files: File[];
    hashString: string;
    haveUnchecked: number;
    haveValid: number;
    honorsSessionLimits: boolean;
    id: number;
    isFinished: boolean;
    isPrivate: boolean;
    leftUntilDone: number;
    magnetLink: string;
    manualAnnounceTime: number;
    maxConnectedPeers: number;
    metadataPercentComplete: number;
    name: string;
    "peer-limit": number;
    peers: Peer[];
    peersConnected: number;
    peersFrom: {
        fromCache: number;
        fromDht: number;
        fromIncoming: number;
        fromLpd: number;
        fromLtep: number;
        fromPex: number;
        fromTracker: number;
    };
    peersGettingFromUs: number;
    peersSendingToUs: number;
    percentDone: number;
    pieceCount: number;
    pieceSize: number;
    pieces: string;
    priorities: number[];
    rateDownload: number;
    rateUpload: number;
    recheckProgress: number;
    seedIdleLimit: number;
    seedIdleMode: number;
    seedRatioLimit: number;
    seedRatioMode: number;
    sizeWhenDone: number;
    startDate: number;
    status: number;
    torrentFile: string;
    totalSize: number;
    trackerStats: TrackerStat[];
    trackers: Tracker[];
    uploadLimit: number;
    uploadLimited: boolean;
    uploadRatio: number;
    uploadedEver: number;
    wanted: number[];
    webseeds: any[];
    webseedsSendingToUs: number;
}
export interface Session {
    "alt-speed-down"?: number;
    "alt-speed-enabled"?: boolean;
    "alt-speed-time-begin"?: number;
    "alt-speed-time-day"?: number;
    "alt-speed-time-enabled"?: boolean;
    "alt-speed-time-end"?: number;
    "alt-speed-up"?: number;
    "blocklist-enabled"?: boolean;
    "blocklist-size"?: number;
    "blocklist-url"?: string;
    "cache-size-mb"?: number;
    "config-dir"?: string;
    "dht-enabled"?: boolean;
    "download-dir"?: string;
    "download-dir-free-space"?: number;
    "download-queue-enabled"?: boolean;
    "download-queue-size"?: number;
    "encryption"?: string;
    "idle-seeding-limit"?: number;
    "idle-seeding-limit-enabled"?: boolean;
    "incomplete-dir"?: string;
    "incomplete-dir-enabled"?: boolean;
    "lpd-enabled"?: boolean;
    "peer-limit-global"?: number;
    "peer-limit-per-torrent"?: number;
    "peer-port"?: number;
    "peer-port-random-on-start"?: boolean;
    "pex-enabled"?: boolean;
    "port-forwarding-enabled"?: boolean;
    "queue-stalled-enabled"?: boolean;
    "queue-stalled-minutes"?: number;
    "rename-partial-files"?: boolean;
    "rpc-version"?: number;
    "rpc-version-minimum"?: number;
    "script-torrent-done-enabled"?: boolean;
    "script-torrent-done-filename"?: string;
    "seed-queue-enabled"?: boolean;
    "seed-queue-size"?: number;
    "seedRatioLimit"?: number;
    "seedRatioLimited"?: boolean;
    "speed-limit-down"?: number;
    "speed-limit-down-enabled"?: boolean;
    "speed-limit-up"?: number;
    "speed-limit-up-enabled"?: boolean;
    "start-added-torrents"?: boolean;
    "trash-original-torrent-files"?: boolean;
    "units"?: {
        "memory-bytes"?: number;
        "memory-units"?: string[];
        "size-bytes"?: number;
        "size-units"?: string[];
        "speed-bytes"?: number;
        "speed-units"?: string[];
    };
    "utp-enabled"?: boolean;
    "version"?: string;
}
export interface Status {
    "activeTorrentCount": number;
    "cumulative-stats": {
        "downloadedBytes": number;
        "filesAdded": number;
        "secondsActive": number;
        "sessionCount": number;
        "uploadedBytes": number;
    };
    "current-stats": {
        "downloadedBytes": number;
        "filesAdded": number;
        "secondsActive": number;
        "sessionCount": number;
        "uploadedBytes": number;
    };
    "downloadSpeed": number;
    "pausedTorrentCount": number;
    "torrentCount": number;
    "uploadSpeed": number;
}
