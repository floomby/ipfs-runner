"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
// import net from "net";
var zeromq_1 = require("zeromq");
var IPFS = require("ipfs-core");
var web3_1 = require("web3");
var transactor_1 = require("./transactor");
var web3 = new web3_1["default"]("ws://127.0.0.1:8545");
// Hardhat #1
var account = web3.eth.accounts.wallet.add("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
var addresses = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../smartcontracts/addresses.json"), "utf8"));
var abi = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../smartcontracts/abi/Dispatch.json"), "utf8"));
var options = {
    filter: {
        value: []
    },
    fromBlock: 0
};
var sock = zeromq_1["default"].socket("push");
var results = zeromq_1["default"].socket("pull");
sock.bindSync("tcp://*:5555");
console.log("Producer bound to port 5555");
results.connect("tcp://172.17.0.1:5556");
console.log("Result subscription connected on port 5556");
var dispatchContract = new web3.eth.Contract(abi, addresses.dispatch);
var Dispatch = /** @class */ (function () {
    function Dispatch(ipfsPath, ipfs, selector, address, web3, dispatcher) {
        this.ipfsPath = ipfsPath;
        this.ipfs = ipfs;
        this.selector = selector;
        this.address = address;
        this.web3 = web3;
        this.dispatcher = dispatcher;
    }
    Dispatch.prototype.init = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var index, content, _b, _c, buf, e_1_1, contentData;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = __asyncValues(this.ipfs.get(this.ipfsPath));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        buf = _c.value;
                        if (index === 1) {
                            content = buf.toString();
                            return [3 /*break*/, 5];
                        }
                        ++index;
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(_b)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        console.log(content);
                        contentData = JSON.parse(content);
                        this.code = contentData.code;
                        this.abi = contentData.abi;
                        this.contract = new this.web3.eth.Contract(JSON.parse(this.abi), this.address);
                        console.log("Contract address is ", this.address);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Dispatch.prototype.createClosure = function (args) {
        var txObject = this.contract.methods[this.selector](args);
        console.dir(txObject);
        console.log("selector is", this.selector);
        return this.dispatcher.methods.forward(this.address, txObject.encodeABI(args));
    };
    return Dispatch;
}());
var dispatches = new Map();
var transactor = new transactor_1["default"](account, web3);
results.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tx, result, dispatch, closure;
    return __generator(this, function (_b) {
        console.log("Result received", msg.toString());
        _a = JSON.parse(msg.toString()), tx = _a.tx, result = _a.result;
        dispatch = dispatches.get(tx);
        if (dispatch) {
            closure = dispatch.createClosure(result);
            transactor.sendTransaction(closure, function () {
                dispatches["delete"](tx);
            });
        }
        else {
            console.log("Dispatch for transaction not found");
        }
        return [2 /*return*/];
    });
}); });
var callbackApi = "[{\n  \"inputs\": [\n    {\n      \"internalType\": \"uint256\",\n      \"name\": \"\",\n      \"type\": \"uint256\"\n    }\n  ],\n  \"name\": \"callback\",\n  \"outputs\": [],\n  \"stateMutability\": \"nonpayable\",\n  \"type\": \"function\"\n}]";
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var ipfs, cid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, IPFS.create()];
            case 1:
                ipfs = _a.sent();
                return [4 /*yield*/, ipfs.add(Buffer.from(JSON.stringify({
                        code: "module.exports = async (axiosPath) => { return [123]; };",
                        abi: callbackApi
                    })))];
            case 2:
                cid = (_a.sent()).cid;
                console.log("Added to IPFS ", cid);
                dispatchContract.events.allEvents(options, function (error, event) { return __awaiter(void 0, void 0, void 0, function () {
                    var dispatch, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!error) return [3 /*break*/, 1];
                                console.error(error);
                                return [3 /*break*/, 5];
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                dispatch = new Dispatch(event.returnValues.ipfsPath, ipfs, event.returnValues.selector, event.returnValues._address, web3, dispatchContract);
                                return [4 /*yield*/, dispatch.init()];
                            case 2:
                                _a.sent();
                                dispatches.set(event.transactionHash, dispatch);
                                sock.send(JSON.stringify({ tx: event.transactionHash, code: dispatch.code }));
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.error(error_1);
                                return [3 /*break*/, 4];
                            case 4:
                                console.log(event);
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); })();
