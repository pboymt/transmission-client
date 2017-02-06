/// <reference types="node" />
import { EventEmitter } from 'events';
import { TransmissionOptions, File, FileStat, Peer, Torrent, Session, Status } from './interface';
export { TransmissionOptions, File, FileStat, Peer, Torrent, Session, Status };
/**
 * Transmission Client using RPC.
 */
export declare class Transmission extends EventEmitter {
    private http;
    private authHeader;
    /**
     * Array of Transmission Status.
     */
    readonly statusArray: string[];
    private status;
    /**
     * Methods can be used in Transmission RPC.
     */
    readonly methods: {
        torrents: {
            stop: string;
            start: string;
            startNow: string;
            verify: string;
            reannounce: string;
            set: string;
            setTypes: {
                'bandwidthPriority': boolean;
                'downloadLimit': boolean;
                'downloadLimited': boolean;
                'files-wanted': boolean;
                'files-unwanted': boolean;
                'honorsSessionLimits': boolean;
                'ids': boolean;
                'location': boolean;
                'peer-limit': boolean;
                'priority-high': boolean;
                'priority-low': boolean;
                'priority-normal': boolean;
                'seedRatioLimit': boolean;
                'seedRatioMode': boolean;
                'uploadLimit': boolean;
                'uploadLimited': boolean;
            };
            add: string;
            addTypes: {
                'download-dir': boolean;
                'filename': boolean;
                'metainfo': boolean;
                'paused': boolean;
                'peer-limit': boolean;
                'files-wanted': boolean;
                'files-unwanted': boolean;
                'priority-high': boolean;
                'priority-low': boolean;
                'priority-normal': boolean;
            };
            rename: string;
            remove: string;
            removeTypes: {
                'ids': boolean;
                'delete-local-data': boolean;
            };
            location: string;
            locationTypes: {
                'location': boolean;
                'ids': boolean;
                'move': boolean;
            };
            get: string;
            fields: string[];
        };
        session: {
            stats: string;
            get: string;
            set: string;
            setTypes: {
                'start-added-torrents': boolean;
                'alt-speed-down': boolean;
                'alt-speed-enabled': boolean;
                'alt-speed-time-begin': boolean;
                'alt-speed-time-enabled': boolean;
                'alt-speed-time-end': boolean;
                'alt-speed-time-day': boolean;
                'alt-speed-up': boolean;
                'blocklist-enabled': boolean;
                'dht-enabled': boolean;
                'encryption': boolean;
                'download-dir': boolean;
                'peer-limit-global': boolean;
                'peer-limit-per-torrent': boolean;
                'pex-enabled': boolean;
                'peer-port': boolean;
                'peer-port-random-on-start': boolean;
                'port-forwarding-enabled': boolean;
                'seedRatioLimit': boolean;
                'seedRatioLimited': boolean;
                'speed-limit-down': boolean;
                'speed-limit-down-enabled': boolean;
                'speed-limit-up': boolean;
                'speed-limit-up-enabled': boolean;
            };
        };
        other: {
            blockList: string;
            port: string;
            freeSpace: string;
        };
    };
    /**
     * Options of Transmission Client.
     */
    options: TransmissionOptions;
    constructor(options?: TransmissionOptions);
    /**
     * Change status of Torrent task.
     */
    set(ids: string | string[], options?: {
        [key: string]: any;
    }): Promise<void>;
    /**
     * Add a Torrent from local file.
     */
    addFile(filePath: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    /**
     * Add a Torrent from Base64-string serialized from a local .torrent file.
     */
    addBase64(fileb64: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    /**
     * Add a Torrent from a HashString.
     */
    addHash(HASH: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    /**
     * Add a Torrent from a MagnetLink.
     */
    addMagnet(MagnetLink: string, options: any): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    /**
     * Add a Torrent from a .torrent file in URL.
     */
    addURL(URL: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    private addTorrentDataSrc(args, options?);
    /**
     * Remove (to trash) Torrent(s) from list by HashString.
     */
    remove(ids: string | string[], deleteIt?: boolean): Promise<void>;
    /**
     * Moving a Torrent
     */
    move(ids: string | string[], newLocation: string, moveNow?: boolean): Promise<any>;
    /**
     * Rename a Torrent.
     */
    rename(id: string, oldName: string, newName: string): Promise<any>;
    /**
     * Getting Torrents status.
     */
    get(ids?: string | string[]): Promise<{
        torrents: Torrent[];
    }>;
    /**
     * waitForState
     */
    waitForState(id: string, targetState: string): Promise<void>;
    /**
     * Get Peers of Torrent(s).
     */
    peers(ids: string | string[]): Promise<[{
        hashString: string;
        id: string;
        peers: Peer[];
    }]>;
    /**
     * Getting Filelist of Torrent(s).
     */
    files(ids: string | string[]): Promise<[{
        hashString: string;
        id: string;
        fileStats: FileStat[];
        files: File[];
    }]>;
    /**
     * Getting Torrent Status Fast.
     */
    getFast(ids: string | string[]): Promise<any>;
    /**
     * Stop Torrent(s).
     */
    stop(ids: string | string[]): Promise<void>;
    /**
     * Stop All Torrents.
     */
    stopAll(): Promise<void>;
    /**
     * Start Torrent(s).
     */
    start(ids: string | string[]): Promise<void>;
    /**
     * Start All Torrents.
     */
    startAll(): Promise<void>;
    /**
     * Start Torrent(s) now.
     */
    startNow(ids: string | string[]): Promise<void>;
    /**
     * Verify Torrent(s).
     */
    verify(ids: string | string[]): Promise<void>;
    /**
     * Ask tracker for more peers.
     */
    reannounce(ids: string | string[]): Promise<void>;
    /**
     * Getting list of all Torrents and all fields.
     */
    all(): Promise<{
        torrents: Torrent[];
    }>;
    /**
     * Getting recently-active Torrents.
     */
    active(): Promise<{
        removed: number[];
        torrents: Torrent[];
    }>;
    /**
     * Getting Transmission-daemon Session Status.
     */
    getSession(): Promise<Session>;
    /**
     * Setting Transmission-daemon Session Status.
     */
    setSession(data: Session): Promise<any>;
    /**
     * Getting Current Transmission-daemon Status.
     */
    sessionStats(): Promise<Status>;
    /**
     * Getting free space of a given path.
     */
    freeSpace(path: string): Promise<{
        path: string;
        "size-bytes": number;
    }>;
    /**
     * Main Method.
     */
    callServer(query: Object): Promise<any>;
    private S4();
    private uuid();
}
