/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { gunzip } from "https://taisukef.github.io/zlib.js/es/gunzip.js";
import { DictionaryLoader } from "./DictionaryLoader.js";

/**
 * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
 * @param {string} dic_path Dictionary path
 * @constructor
 */
export function BrowserDictionaryLoader(dic_path) {
    DictionaryLoader.apply(this, [dic_path]);
}

BrowserDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);

/**
 * Utility function to load gzipped dictionary
 * @param {string} url Dictionary URL
 */
BrowserDictionaryLoader.prototype.loadArrayBuffer = async function (url) {
    try {
        const a = new Uint8Array(await (await fetch(url)).arrayBuffer());
        const res = gunzip(a);
        return res.buffer;
    } catch (e) {
        const a = new Uint8Array(await Deno.readFile(url));
        const res = gunzip(a);
        return res.buffer;
    }
};
