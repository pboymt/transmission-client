import * as http from 'http';
import * as https from 'https';
import * as util from 'util';
import * as fs from 'fs';
import { EventEmitter } from 'events';
export interface TransmissionOptions {
    url?: string
    host?: string
    port?: number
    ssl?: boolean
    key?: any
    username?: string
    password?: string
}
const defaultOptions: TransmissionOptions = {
    url: '/transmission/rpc',
    host: 'localhost',
    port: 9091,
    ssl: false,
    key: null,
    username: null,
    password: null,
}
export class Transmission extends EventEmitter {

    private http: any = https;

    private authHeader: string;
    readonly statusArray = ['STOPPED', 'CHECK_WAIT', 'CHECK', 'DOWNLOAD_WAIT', 'DOWNLOAD', 'SEED_WAIT', 'SEED', 'ISOLATED'];
    private status: { [status: string]: number } = {};

    readonly methods = {
        torrents: {
            stop: 'torrent-stop',
            start: 'torrent-start',
            startNow: 'torrent-start-now',
            verify: 'torrent-verify',
            reannounce: 'torrent-reannounce',
            set: 'torrent-set',
            setTypes: {
                'bandwidthPriority': true,
                'downloadLimit': true,
                'downloadLimited': true,
                'files-wanted': true,
                'files-unwanted': true,
                'honorsSessionLimits': true,
                'ids': true,
                'location': true,
                'peer-limit': true,
                'priority-high': true,
                'priority-low': true,
                'priority-normal': true,
                'seedRatioLimit': true,
                'seedRatioMode': true,
                'uploadLimit': true,
                'uploadLimited': true
            },
            add: 'torrent-add',
            addTypes: {
                'download-dir': true,
                'filename': true,
                'metainfo': true,
                'paused': true,
                'peer-limit': true,
                'files-wanted': true,
                'files-unwanted': true,
                'priority-high': true,
                'priority-low': true,
                'priority-normal': true
            },
            rename: 'torrent-rename-path',
            remove: 'torrent-remove',
            removeTypes: {
                'ids': true,
                'delete-local-data': true
            },
            location: 'torrent-set-location',
            locationTypes: {
                'location': true,
                'ids': true,
                'move': true
            },
            get: 'torrent-get',
            fields: ['activityDate', 'addedDate', 'bandwidthPriority', 'comment', 'corruptEver', 'creator', 'dateCreated', 'desiredAvailable', 'doneDate', 'downloadDir', 'downloadedEver', 'downloadLimit', 'downloadLimited', 'error', 'errorString', 'eta', 'files', 'fileStats', 'hashString', 'haveUnchecked', 'haveValid', 'honorsSessionLimits', 'id', 'isFinished', 'isPrivate', 'leftUntilDone', 'magnetLink', 'manualAnnounceTime', 'maxConnectedPeers', 'metadataPercentComplete', 'name', 'peer-limit', 'peers', 'peersConnected', 'peersFrom', 'peersGettingFromUs', 'peersKnown', 'peersSendingToUs', 'percentDone', 'pieces', 'pieceCount', 'pieceSize', 'priorities', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedIdleLimit', 'seedIdleMode', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'startDate', 'status', 'trackers', 'trackerStats', 'totalSize', 'torrentFile', 'uploadedEver', 'uploadLimit', 'uploadLimited', 'uploadRatio', 'wanted', 'webseeds', 'webseedsSendingToUs']
        },
        session: {
            stats: 'session-stats',
            get: 'session-get',
            set: 'session-set',
            setTypes: {
                'start-added-torrents': true,
                'alt-speed-down': true,
                'alt-speed-enabled': true,
                'alt-speed-time-begin': true,
                'alt-speed-time-enabled': true,
                'alt-speed-time-end': true,
                'alt-speed-time-day': true,
                'alt-speed-up': true,
                'blocklist-enabled': true,
                'dht-enabled': true,
                'encryption': true,
                'download-dir': true,
                'peer-limit-global': true,
                'peer-limit-per-torrent': true,
                'pex-enabled': true,
                'peer-port': true,
                'peer-port-random-on-start': true,
                'port-forwarding-enabled': true,
                'seedRatioLimit': true,
                'seedRatioLimited': true,
                'speed-limit-down': true,
                'speed-limit-down-enabled': true,
                'speed-limit-up': true,
                'speed-limit-up-enabled': true
            }
        },
        other: {
            blockList: 'blocklist-update',
            port: 'port-test',
            freeSpace: 'free-space'
        }
    };

    options: TransmissionOptions = defaultOptions;

    constructor(options: TransmissionOptions = {}) {
        super();
        Object.assign(this.options, options);
        this.http = this.options.ssl ? https : http;
        this.statusArray.forEach((status, index) => {
            this.status[status] = index;
        });
        if (this.options.username != null) {
            this.authHeader = 'Basic ' + new Buffer(this.options.username + (this.options.password ? ':' + this.options.password : '')).toString('base64');
            //this.authHeader = encodeURI(this.authHeader);
            //console.log(this.authHeader);
        }
    }

    async set(ids: string | string[], options: { [key: string]: any } = null) {
        ids = Array.isArray(ids) ? ids : [ids];
        let args = { ids: ids };

        if (typeof options === 'object') {
            let keys = Object.keys(options);
            for (let key of keys) {
                args[key] = options[key];
            }
        } else {
            throw new Error('Arguments mismatch for "bt.set"');
        }

        return await this.callServer({
            arguments: args,
            method: this.methods.torrents.set,
            tag: this.uuid()
        });
    }

    async add(URL: string, options: { [key: string]: any } = null) {
        this.addURL(URL, options);
    }

    async addFile(filePath: string, options: { [key: string]: any } = null) {
        var self = this;
        let data: Buffer = fs.readFileSync(filePath);
        let fileContentBase64 = data.toString('base64');
        return await this.addTorrentDataSrc({
            metainfo: fileContentBase64
        }, options);
    }

    async addBase64(fileb64: string, options: { [key: string]: any } = null) {
        return await this.addTorrentDataSrc({
            metainfo: fileb64
        }, options);
    }

    async addURL(URL: string, options: { [key: string]: any } = null) {
        return await this.addTorrentDataSrc({
            filename: URL
        }, options);
    }

    async addTorrentDataSrc(args: { [key: string]: any }, options?: { [key: string]: any }) {
        if (typeof options === 'object') {
            let keys = Object.keys(options);
            for (let key of keys) {
                args[key] = options[key];
            }
        } else {
            throw new Error('Arguments mismatch for "bt.add"');
        }
        return await this.callServer({
            arguments: args,
            method: this.methods.torrents.add,
            tag: this.uuid()
        })
            .then((result) => {
                let torrent = result['torrent-duplicate'] ? result['torrent-duplicate'] : result['torrent-added'];
                return torrent;
            })
            .catch((err) => {
                throw err;
            });
    }

    async remove(ids: string | string[], del: boolean = false) {
        ids = Array.isArray(ids) ? ids : [ids];
        let options = {
            arguments: {
                ids: ids,
                'delete-local-data': !!del
            },
            method: this.methods.torrents.remove,
            tag: this.uuid()
        };
        return await this.callServer(options);
    }

    async move(ids: string | string[], location: string, move: boolean = true) {
        ids = Array.isArray(ids) ? ids : [ids];
        var options = {
            arguments: {
                ids: ids,
                location: location,
                move: move
            },
            method: this.methods.torrents.location,
            tag: this.uuid()
        };
        return await this.callServer(options);
    }

    async rename(ids: string | string[], pathName: string, name: string) {
        ids = Array.isArray(ids) ? ids : [ids];
        let options = {
            arguments: {
                ids: ids,
                path: pathName,
                name: name
            },
            method: this.methods.torrents.rename,
            tag: this.uuid()
        };
        return await this.callServer(options);
    }

    async get(ids?: string | string[]) {
        let options = {
            arguments: {
                fields: this.methods.torrents.fields,
                ids: Array.isArray(ids) ? ids : [ids]
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        };

        if (!ids) {
            delete options.arguments.ids;
        }

        let res = await this.callServer(options);
        console.log(res);
        return res;
    }

    async waitForState(id: string, targetState: string) {
        let self = this;
        let latestState = 'unknown';
        let latestTorrent = null;
        // async.whilst(function (a) {
        //     return latestState !== targetState;
        // }, function (whilstCb) {
        //     self.get(id, function (err, result) {
        //         if (err) {
        //             return whilstCb(err);
        //         }
        //         var torrent = result.torrents[0];

        //         if (!torrent) {
        //             return callback(new Error('No id (' + id + ') found for torrent'))
        //         }

        //         latestTorrent = torrent;
        //         latestState = self.statusArray[torrent.status];
        //         if (latestState === targetState) {
        //             whilstCb(null, torrent);
        //         } else {
        //             setTimeout(whilstCb, 1000);
        //         }
        //     });
        // }, function (err) {
        //     if (err) {
        //         return callback(err)
        //     }
        //     callback(null, latestTorrent);

        // });
    }

    async peers(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        var options = {
            arguments: {
                fields: ['peers', 'hashString', 'id'],
                ids: ids
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        };

        return await this.callServer(options)
            .then((result) => {
                return result['torrents'];
            })
            .catch((err) => {
                throw err;
            });
    }

    async files(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        let options = {
            arguments: {
                fields: ['files', 'fileStats', 'hashString', 'id'],
                ids: ids
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        };

        return await this.callServer(options)
            .then((result) => {
                return result['torrents'];
            })
            .catch((err) => {
                throw err;
            });
    }

    async fast(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        let options = {
            arguments: {
                fields: ['id', 'error', 'errorString', 'eta', 'isFinished', 'isStalled', 'leftUntilDone', 'metadataPercentComplete', 'peersConnected', 'peersGettingFromUs', 'peersSendingToUs', 'percentDone', 'queuePosition', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedRatioMode', 'seedRatioLimit', 'sizeWhenDone', 'status', 'trackers', 'uploadedEver', 'uploadRatio'],
                ids: ids
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        };
        return await this.callServer(options).then((result) => {
            return result['torrents'];
        }).catch((err) => {
            throw err;
        });
    }

    async stop(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        return await this.callServer({
            arguments: {
                ids: ids
            },
            method: this.methods.torrents.stop,
            tag: this.uuid()
        });
    }

    async stopAll() {
        return await this.callServer({
            method: this.methods.torrents.stop
        });
    }

    async start(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        return await this.callServer({
            arguments: {
                ids: ids
            },
            method: this.methods.torrents.start,
            tag: this.uuid()
        });
    }

    async startAll() {
        return await this.callServer({
            method: this.methods.torrents.start
        });
    }

    async startNow(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        return await this.callServer({
            arguments: {
                ids: ids
            },
            method: this.methods.torrents.startNow,
            tag: this.uuid()
        });
    }

    async verify(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        return await this.callServer({
            arguments: {
                ids: ids
            },
            method: this.methods.torrents.verify,
            tag: this.uuid()
        });
    }

    async reannounce(ids: string | string[]) {
        ids = Array.isArray(ids) ? ids : [ids];
        return await this.callServer({
            arguments: {
                ids: ids
            },
            method: this.methods.torrents.reannounce,
            tag: this.uuid()
        });
    }

    async all() {
        return await this.callServer({
            arguments: {
                fields: this.methods.torrents.fields
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        });
    }

    async active() {
        return await this.callServer({
            arguments: {
                fields: this.methods.torrents.fields,
                ids: 'recently-active'
            },
            method: this.methods.torrents.get,
            tag: this.uuid()
        });
    }

    async getSession() {
        return await this.callServer({
            method: this.methods.session.get,
            tag: this.uuid()
        });
    }

    async setSession(data: { [key: string]: boolean }) {
        let keys = Object.keys(data);
        for (let key of keys) {
            if (!this.methods.session.setTypes[key]) {
                var error = new Error('Cant set type ' + key);
                // error.result = page; // FIXME: page not defined
                throw error;
                //return this;
            }
        }
        return await this.callServer({
            arguments: data,
            method: this.methods.session.set,
            tag: this.uuid()
        });
    }

    async sessionStats() {
        return await this.callServer({
            method: this.methods.session.stats,
            tag: this.uuid()
        });
    }

    async freeSpace(path: string) {
        return await this.callServer({
            arguments: {
                path: path
            },
            method: this.methods.other.freeSpace
        });
    }

    async callServer(query: Object) {
        const self = this;
        const queryJsonify = JSON.stringify(query);
        let options = {
            host: this.options.host,
            path: this.options.url,
            port: this.options.port,
            method: 'POST',
            headers: {
                'Time': new Date().toUTCString(),
                'Host': this.options.host + ':' + this.options.port,
                'X-Requested-With': 'Node',
                'X-Transmission-Session-Id': this.options.key || '',
                'Content-Length': queryJsonify.length,
                'Content-Type': 'application/json'
            }
        };

        if (this.authHeader) {
            options.headers['Authorization'] = this.authHeader;
        }

        return new Promise((resolve, reject) => {
            //console.log(options);
            //console.log(queryJsonify);
            let req = this.http.request(options, (res) => {
                let page: Buffer[] = [];

                res.setEncoding('utf8');

                res.on('data', (chunk: Buffer) => {
                    page.push(chunk);
                });

                res.on('end', () => {
                    let json, error;
                    if (res.statusCode === 409) {
                        console.log(409);
                        self.options.key = res.headers['x-transmission-session-id'];
                        this.callServer(query)
                            .then(res => {
                                resolve(res);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else if (res.statusCode === 200) {
                        let str;
                        if (typeof page[0] === 'string') {
                            str = page.join('');
                        } else {
                            str = Buffer.concat(page).toString();
                        }
                        try {
                            json = JSON.parse(str);
                            //console.log(json);
                        } catch (err) {
                            reject(err);
                        }

                        if (json.result === 'success') {
                            console.log('success');
                            //console.log(json.arguments);
                            resolve(json.arguments);
                        } else {
                            error = new Error(json.result);
                            error.result = str;
                            reject(error);
                        }
                    } else {
                        error = new Error('Status code mismatch: ' + res.statusCode);
                        error.result = page;
                        reject(error);
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            }).end(queryJsonify, 'utf8');

        });
    }

    private S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    private uuid() {
        return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4());
    }
}