/*
Copyright 2018 Hermann Krumrey <hermann@krumreyh.com>

This file is part of anilist-enhancer.

anilist-enhancer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

anilist-enhancer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with anilist-enhancer.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Runs the main script every 100ms until stopped
 * @type {number} The interval number
 */
setInterval(main, 500);
let url = window.location.href;

/**
 * The main function of this script
 */
function main() {

    if (document.getElementsByClassName("data").length === 0) {
        // Continue
    }
    else if (
        !window.location.href.includes("anilist.co/anime/") &&
        !window.location.href.includes("anilist.co/manga/")) {
        // Continue
    }
    else if (document.getElementById("anilist-enhancer-table") === null) {
        loadData();
    }
    else if (url !== window.location.href) {
        url = window.location.href;
        document.getElementsByClassName("sidebar")[0].removeChild(
            document.getElementById("anilist-enhancer-table")
        );
        loadData();
    }
}

/**
 * Loads the data into the sidebar
 */
function loadData() {
    prepare();
    const anilistId = getAnilistId();
    const anilistType = getAnilistType();
    displayButton(anilistId, "", "/img/icons/icon.svg");
    displayMyanimelistData(anilistId, anilistType);
    displayOtakuInfoIds(anilistId, anilistType);
}

/**
 * Prepares divs for the new data
 */
function prepare() {

    let buttonTable = document.createElement("table");
    buttonTable.id = "anilist-enhancer-table";
    buttonTable.style.textAlign = "center";
    buttonTable.style.width = "100%";
    buttonTable.style.marginBottom = "15px";

    const beforeButtons = document.getElementsByClassName("sidebar")[0].children[0];
    document.getElementsByClassName("sidebar")[0].insertBefore(buttonTable, beforeButtons);
}

/**
 * Retrieves the anilist ID of the page
 * @returns {number} The anilist ID
 */
function getAnilistId() {
    const url = window.location.href;
    return Number(url.split("https://anilist.co/")[1].split("/")[1])
}

/**
 * Retrieves the anilist type, either anime or manga
 * @returns {string} The anilist entry type
 */
function getAnilistType() {
    const url = window.location.href;
    return url.split("https://anilist.co/")[1].split("/")[0]
}

function displayOtakuInfoIds(anilistId, anilistType) {
	var url = 'https://otaku-info.eu/api/v1/media_ids/anilist/' + anilistType + '/' + anilistId;

    fetch(url)
    	.then(function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        })
        .then(function handleData(data) {
        	for (service in data["data"]) {
        		id = data["data"][service]
        		console.log(service);
        		if (service === "otaku_info") {
        			displayButton(
        				id, 
        				"https://otaku-info.eu/media/" + id,
        				"https://otaku-info.eu/static/logo.png"
        			);
        		}
        		if (service === "mangadex") {
        			displayButton(
        				id, 
        				"https://mangadex.org/title/" + id, 
        				"https://mangadex.org/images/misc/navbar.svg"
        			);
        		}
        		if (service === "mangaupdates") {
        			displayButton(
        				id, 
        				"https://www.mangaupdates.com/series.html?id=" + id, 
        				"https://i.imgur.com/EX348cq.jpg"
        			);
        		}
        	}        	
        })
        .catch(function handleError(error) {
            console.error(error);
        });
}

/**
 * Displays myanimelist.net information in the data section
 * @param anilistId {Number} The anilist ID
 * @param anilistType {String} The anilist media type
 */
function displayMyanimelistData(anilistId, anilistType) {

    const url = 'https://graphql.anilist.co';
    let query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        idMal
      }
    }
    `;
    const variables = {id: anilistId};

    if (anilistType === "manga") {
        query = query.replace("ANIME", "MANGA")
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(url, options)
        .then(function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        })
        .then(function handleData(data) {
            if (data["data"] !== null) {
                const malId = data["data"]["Media"]["idMal"];
                if (malId !== null) {
                    const malUrl = "https://myanimelist.net/" + anilistType + "/" + malId;
                    const malImg = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
                    displayButton(malId, malUrl, malImg);
                }
            }
        })
        .catch(function handleError(error) {
            console.error(error);
        });
}


/**
 * Shows the a button on the side bar
 * @param id {Number} The ID to display
 * @param url {String} The URL to which to link to
 * @param imgUrl {String} The URL linking to the image for the button
 */
function displayButton(id, url, imgUrl) {

    let entry = document.createElement("tr");
    let imageCol = document.createElement("td");
    let idCol = document.createElement("td");

    let buttonLink = document.createElement("a");
    buttonLink.href = url;

    let buttonImg = document.createElement('img');
    buttonImg.src = imgUrl;
    buttonImg.width = 50;
    buttonImg.height = 50;
    buttonImg.style.background = "black";

    let idText = document.createTextNode(id.toString());

    buttonLink.appendChild(buttonImg);
    imageCol.appendChild(buttonLink);
    idCol.appendChild(idText);
    entry.appendChild(imageCol);
    entry.appendChild(idCol);

    document.getElementById("anilist-enhancer-table").appendChild(entry);
}
