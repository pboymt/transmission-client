"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const http = require('http');
const https = require('https');
const fs = require('fs');
const events_1 = require('events');
const defaultOptions = {
    url: '/transmission/rpc',
    host: 'localhost',
    port: 9091,
    ssl: false,
    key: null,
    username: null,
    password: null,
};
/**
 * Transmission Client using RPC.
 */
class Transmission extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.http = https;
        /**
         * Array of Transmission Status.
         */
        this.statusArray = ['STOPPED', 'CHECK_WAIT', 'CHECK', 'DOWNLOAD_WAIT', 'DOWNLOAD', 'SEED_WAIT', 'SEED', 'ISOLATED'];
        this.status = {};
        /**
         * Methods can be used in Transmission RPC.
         */
        this.methods = {
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
        /**
         * Options of Transmission Client.
         */
        this.options = defaultOptions;
        Object.assign(this.options, options);
        this.http = this.options.ssl ? https : http;
        this.statusArray.forEach((status, index) => {
            this.status[status] = index;
        });
        if (this.options.username != null) {
            this.authHeader = 'Basic ' + new Buffer(this.options.username + (this.options.password ? ':' + this.options.password : '')).toString('base64');
        }
    }
    /**
     * Change status of Torrent task.
     */
    set(ids, options = null) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            let args = { ids: ids };
            if (typeof options === 'object') {
                let keys = Object.keys(options);
                for (let key of keys) {
                    args[key] = options[key];
                }
            }
            else {
                throw new Error('Arguments mismatch for "bt.set"');
            }
            let res = yield this.callServer({
                arguments: args,
                method: this.methods.torrents.set,
                tag: this.uuid()
            });
            if (res != {}) {
                throw new Error('Unknown Error in "bt.set"');
            }
        });
    }
    /**
     * Add a Torrent from local file.
     */
    addFile(filePath, options = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var self = this;
            let data = fs.readFileSync(filePath);
            let fileContentBase64 = data.toString('base64');
            return yield this.addTorrentDataSrc({
                metainfo: fileContentBase64
            }, options);
        });
    }
    /**
     * Add a Torrent from Base64-string serialized from a local .torrent file.
     */
    addBase64(fileb64, options = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addTorrentDataSrc({
                metainfo: fileb64
            }, options);
        });
    }
    /**
     * Add a Torrent from a HashString.
     */
    addHash(HASH, options = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addMagnet(HASH, options);
        });
    }
    /**
     * Add a Torrent from a MagnetLink.
     */
    addMagnet(MagnetLink, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MagnetLink.match(/^[0-9A-z]{32,40}$/)) {
                MagnetLink = 'magnet:?xt=urn:btih:' + URL;
            }
            return yield this.addURL(MagnetLink, options);
        });
    }
    /**
     * Add a Torrent from a .torrent file in URL.
     */
    addURL(URL, options = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addTorrentDataSrc({
                filename: URL
            }, options);
        });
    }
    addTorrentDataSrc(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'object') {
                // let keys = Object.keys(options);
                // for (let key of keys) {
                //     args[key] = options[key];
                // }
                Object.assign(args, options || {});
            }
            else {
                throw new Error('Arguments mismatch for "bt.add"');
            }
            return yield this.callServer({
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
        });
    }
    /**
     * Remove (to trash) Torrent(s) from list by HashString.
     */
    remove(ids, deleteIt = false) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            let options = {
                arguments: {
                    ids: ids,
                    'delete-local-data': Boolean(deleteIt)
                },
                method: this.methods.torrents.remove,
                tag: this.uuid()
            };
            yield this.callServer(options);
        });
    }
    /**
     * Moving a Torrent
     */
    move(ids, newLocation, moveNow = true) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            if (!newLocation.match(/[\/\\]$/)) {
                newLocation = newLocation + '/';
            }
            var options = {
                arguments: {
                    ids: ids,
                    location: newLocation,
                    move: moveNow
                },
                method: this.methods.torrents.location,
                tag: this.uuid()
            };
            return yield this.callServer(options);
        });
    }
    /**
     * Rename a Torrent.
     */
    rename(id, oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = [id];
            let options = {
                arguments: {
                    ids: ids,
                    path: oldName,
                    name: newName
                },
                method: this.methods.torrents.rename,
                tag: this.uuid()
            };
            return yield this.callServer(options);
        });
    }
    /**
     * Getting Torrents status.
     */
    get(ids) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let res = yield this.callServer(options);
            // console.log(res);
            return res;
        });
    }
    /**
     * waitForState
     */
    waitForState(id, targetState) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * Get Peers of Torrent(s).
     */
    peers(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            var options = {
                arguments: {
                    fields: ['peers', 'hashString', 'id'],
                    ids: ids
                },
                method: this.methods.torrents.get,
                tag: this.uuid()
            };
            return yield this.callServer(options)
                .then((result) => {
                return result['torrents'];
            })
                .catch((err) => {
                throw err;
            });
        });
    }
    /**
     * Getting Filelist of Torrent(s).
     */
    files(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            let options = {
                arguments: {
                    fields: ['files', 'fileStats', 'hashString', 'id'],
                    ids: ids
                },
                method: this.methods.torrents.get,
                tag: this.uuid()
            };
            return yield this.callServer(options)
                .then((result) => {
                return result['torrents'];
            })
                .catch((err) => {
                throw err;
            });
        });
    }
    /**
     * Getting Torrent Status Fast.
     */
    getFast(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            let options = {
                arguments: {
                    fields: ['id', 'error', 'errorString', 'eta', 'isFinished', 'isStalled', 'leftUntilDone', 'metadataPercentComplete', 'peersConnected', 'peersGettingFromUs', 'peersSendingToUs', 'percentDone', 'queuePosition', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedRatioMode', 'seedRatioLimit', 'sizeWhenDone', 'status', 'trackers', 'uploadedEver', 'uploadRatio'],
                    ids: ids
                },
                method: this.methods.torrents.get,
                tag: this.uuid()
            };
            return yield this.callServer(options).then((result) => {
                return result['torrents'];
            }).catch((err) => {
                throw err;
            });
        });
    }
    /**
     * Stop Torrent(s).
     */
    stop(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            yield this.callServer({
                arguments: {
                    ids: ids
                },
                method: this.methods.torrents.stop,
                tag: this.uuid()
            });
        });
    }
    /**
     * Stop All Torrents.
     */
    stopAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.callServer({
                method: this.methods.torrents.stop
            });
        });
    }
    /**
     * Start Torrent(s).
     */
    start(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            yield this.callServer({
                arguments: {
                    ids: ids
                },
                method: this.methods.torrents.start,
                tag: this.uuid()
            });
        });
    }
    /**
     * Start All Torrents.
     */
    startAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.callServer({
                method: this.methods.torrents.start
            });
        });
    }
    /**
     * Start Torrent(s) now.
     */
    startNow(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            yield this.callServer({
                arguments: {
                    ids: ids
                },
                method: this.methods.torrents.startNow,
                tag: this.uuid()
            });
        });
    }
    /**
     * Verify Torrent(s).
     */
    verify(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            yield this.callServer({
                arguments: {
                    ids: ids
                },
                method: this.methods.torrents.verify,
                tag: this.uuid()
            });
        });
    }
    /**
     * Ask tracker for more peers.
     */
    reannounce(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            yield this.callServer({
                arguments: {
                    ids: ids
                },
                method: this.methods.torrents.reannounce,
                tag: this.uuid()
            });
        });
    }
    /**
     * Getting list of all Torrents and all fields.
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callServer({
                arguments: {
                    fields: this.methods.torrents.fields
                },
                method: this.methods.torrents.get,
                tag: this.uuid()
            });
        });
    }
    /**
     * Getting recently-active Torrents.
     */
    active() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callServer({
                arguments: {
                    fields: this.methods.torrents.fields,
                    ids: 'recently-active'
                },
                method: this.methods.torrents.get,
                tag: this.uuid()
            });
        });
    }
    /**
     * Getting Transmission-daemon Session Status.
     */
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callServer({
                method: this.methods.session.get,
                tag: this.uuid()
            });
        });
    }
    /**
     * Setting Transmission-daemon Session Status.
     */
    setSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = Object.keys(data);
            for (let key of keys) {
                if (!this.methods.session.setTypes[key]) {
                    var error = new Error('Cant set type ' + key);
                    // error.result = page; // FIXME: page not defined
                    throw error;
                }
            }
            return yield this.callServer({
                arguments: data,
                method: this.methods.session.set,
                tag: this.uuid()
            });
        });
    }
    /**
     * Getting Current Transmission-daemon Status.
     */
    sessionStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callServer({
                method: this.methods.session.stats,
                tag: this.uuid()
            });
        });
    }
    /**
     * Getting free space of a given path.
     */
    freeSpace(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callServer({
                arguments: {
                    path: path
                },
                method: this.methods.other.freeSpace
            });
        });
    }
    /**
     * Main Method.
     */
    callServer(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    let page = [];
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        page.push(chunk);
                    });
                    res.on('end', () => {
                        let json, error;
                        if (res.statusCode === 409) {
                            // console.log(409);
                            self.options.key = res.headers['x-transmission-session-id'];
                            this.callServer(query)
                                .then(res => {
                                resolve(res);
                            })
                                .catch(err => {
                                reject(err);
                            });
                        }
                        else if (res.statusCode === 200) {
                            let str;
                            if (typeof page[0] === 'string') {
                                str = page.join('');
                            }
                            else {
                                str = Buffer.concat(page).toString();
                            }
                            try {
                                json = JSON.parse(str);
                            }
                            catch (err) {
                                reject(err);
                            }
                            if (json.result === 'success') {
                                console.log('success');
                                //console.log(json.arguments);
                                resolve(json.arguments);
                            }
                            else {
                                error = new Error(json.result);
                                error.result = str;
                                reject(error);
                            }
                        }
                        else {
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
        });
    }
    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    ;
    uuid() {
        return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4());
    }
}
exports.Transmission = Transmission;
