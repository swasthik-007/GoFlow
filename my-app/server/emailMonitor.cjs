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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndProcessNewEmails = fetchAndProcessNewEmails;
var axios_1 = require("axios");
var pinecone_1 = require("@pinecone-database/pinecone");
var fs = require("fs");
var path = require("path");
// Setup logging
var logToFile = function (level, message) {
    var timestamp = new Date().toISOString();
    var logMessage = "".concat(timestamp, " - ").concat(level.toUpperCase(), " - ").concat(message, "\n");
    fs.appendFileSync(path.join(__dirname, "email_monitor.log"), logMessage);
    console.log("".concat(level.toUpperCase(), ": ").concat(message));
};
// --- CONFIG ---
var OLLAMA_MODEL = "nomic-embed-text";
var PINECONE_API_KEY = "pcsk_4SqC4L_TTtwUoAJnpL8p6fwoiLY1RgdBSmN7BUs8r2i7696QyrwSXiHxfYEfH2o8mSYyQZ";
var PINECONE_INDEX = "guflow";
var EMAIL_API_URL = "http://localhost:5000/emails";
var CHECK_INTERVAL = 600; // milliseconds (60 seconds)
// --- Connect to Pinecone ---
var pc = new pinecone_1.Pinecone({
    apiKey: PINECONE_API_KEY,
});
// --- Embedding function ---
function getEmbedding(text) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:11434/api/embeddings", {
                            model: OLLAMA_MODEL,
                            prompt: text,
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.data || !response.data.embedding) {
                        throw new Error("Embedding failed");
                    }
                    return [2 /*return*/, response.data.embedding];
                case 2:
                    error_1 = _a.sent();
                    logToFile("error", "Error getting embedding: ".concat(error_1));
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --- Track processed emails ---
var processedEmails = new Set();
function fetchAndProcessNewEmails() {
    return __awaiter(this, void 0, void 0, function () {
        var index, response, emails, newEmails, _i, emails_1, email, emailId, subject, body, text, vector, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    index = pc.index(PINECONE_INDEX);
                    return [4 /*yield*/, axios_1.default.get(EMAIL_API_URL)];
                case 1:
                    response = _a.sent();
                    emails = response.data;
                    newEmails = 0;
                    _i = 0, emails_1 = emails;
                    _a.label = 2;
                case 2:
                    if (!(_i < emails_1.length)) return [3 /*break*/, 8];
                    email = emails_1[_i];
                    emailId = email.id;
                    // Skip if already processed
                    if (processedEmails.has(emailId)) {
                        return [3 /*break*/, 7];
                    }
                    subject = email.subject || "";
                    body = email.body || "";
                    text = "".concat(subject).trim();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, getEmbedding(text)];
                case 4:
                    vector = _a.sent();
                    return [4 /*yield*/, index.upsert([
                            {
                                id: emailId,
                                values: vector,
                                metadata: {
                                    from: email.from,
                                    to: email.to,
                                    subject: subject,
                                    processed_at: new Date().toISOString(),
                                    body: email.body,
                                },
                            },
                        ])];
                case 5:
                    _a.sent();
                    processedEmails.add(emailId);
                    newEmails++;
                    logToFile("info", "Processed email ".concat(emailId));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    logToFile("error", "Failed to process email ".concat(emailId, ": ").concat(error_2));
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8:
                    if (newEmails > 0) {
                        logToFile("info", "Processed ".concat(newEmails, " new emails"));
                    }
                    return [2 /*return*/, newEmails];
                case 9:
                    error_3 = _a.sent();
                    logToFile("error", "Error fetching emails: ".concat(error_3));
                    return [2 /*return*/, 0];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logToFile("info", "Starting email monitoring service");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchAndProcessNewEmails()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, CHECK_INTERVAL); })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    logToFile("critical", "Service crashed: ".concat(error_4));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// For running as a standalone script
if (require.main === module) {
    main().catch(function (error) {
        logToFile("critical", "Service failed to start: ".concat(error));
    });
}
