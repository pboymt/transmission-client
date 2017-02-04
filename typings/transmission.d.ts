/// <reference types="node" />
import { EventEmitter } from 'events';
import { TransmissionOptions, Torrent, Peer } from './interface';
export declare class Transmission extends EventEmitter {
    private http;
    private authHeader;
    readonly statusArray: string[];
    private status;
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
    options: TransmissionOptions;
    constructor(options?: TransmissionOptions);
    set(ids: string | string[], options?: {
        [key: string]: any;
    }): Promise<void>;
    addFile(filePath: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    addBase64(fileb64: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    addHash(HASH: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    addMagnet(MagnetLink: string, options: any): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    addURL(URL: string, options?: {
        [key: string]: any;
    }): Promise<{
        hashString: string;
        id: number;
        name: string;
    }>;
    private addTorrentDataSrc(args, options?);
    remove(ids: string | string[], deleteIt?: boolean): Promise<void>;
    move(ids: string | string[], newLocation: string, moveNow?: boolean): Promise<any>;
    rename(id: string, oldName: string, newName: string): Promise<any>;
    get(ids?: string | string[]): Promise<{
        torrents: Torrent[];
    }>;
    waitForState(id: string, targetState: string): Promise<void>;
    peers(ids: string | string[]): Promise<[{
        hashString: string;
        id: string;
        peers: Peer[];
    }]>;
    files(ids: string | string[]): Promise<any>;
    fast(ids: string | string[]): Promise<any>;
    stop(ids: string | string[]): Promise<any>;
    stopAll(): Promise<any>;
    start(ids: string | string[]): Promise<any>;
    startAll(): Promise<any>;
    startNow(ids: string | string[]): Promise<any>;
    verify(ids: string | string[]): Promise<any>;
    reannounce(ids: string | string[]): Promise<any>;
    all(): Promise<any>;
    active(): Promise<any>;
    getSession(): Promise<any>;
    setSession(data: {
        [key: string]: boolean;
    }): Promise<any>;
    sessionStats(): Promise<any>;
    freeSpace(path: string): Promise<any>;
    callServer(query: Object): Promise<any>;
    private S4();
    private uuid();
}
