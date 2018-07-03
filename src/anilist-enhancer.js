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

prepare();
const anilistId = getAnilistId();
displayMyanimelistData(anilistId, getAnilistType());
displayId(anilistId, "Anilist");

/**
 * Prepares divs for the new data
 */
function prepare() {
    let buttonDiv = document.createElement("div");
    buttonDiv.id = "anilist-enhancer-buttons";
    buttonDiv.style.textAlign = "center";
    buttonDiv.style.marginBottom = "15px";

    const beforeButtons = document.getElementsByClassName("rankings")[0];
    document.getElementsByClassName("sidebar")[0].insertBefore(buttonDiv, beforeButtons);

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

/**
 * Displays myanimelist.net information in the data section
 * @param anilistId {Number} The anilist ID
 * @param anilistType {String} The anilist media type
 */
function displayMyanimelistData(anilistId, anilistType) {

    const url = 'https://graphql.anilist.co';
    const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        idMal
      }
    }
    `;
    const variables = {id: anilistId};
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
                    const malUrl = "https://myanimelist.net/anime/" + malId;
                    const malImg = "https://pbs.twimg.com/profile_images/926302376738377729/SMlpasPv.jpg";
                    displayButton(malUrl, malImg);
                    displayId(malId, "MAL")
                }
            }
        })
        .catch(function handleError(error) {
            console.error(error);
        });
}


/**
 * Shows the a button on the side bar
 * @param url {String} The URL to which to link to
 * @param imgUrl {String} The URL linking to the image for the button
 */
function displayButton(url, imgUrl) {

    let a = document.createElement("a");
    a.href = url;

    let img = document.createElement('img');
    img.src = imgUrl;
    img.width = 50;
    img.height = 50;
    img.className = "ranking";

    a.appendChild(img);
    document.getElementById("anilist-enhancer-buttons").appendChild(a);
}

/**
 * Displays an ID in the sidebar
 * @param id {Number} The ID to display
 * @param name {String} The name of the ID to display
 */
function displayId(id, name) {

    let idDiv = document.createElement("div");
    idDiv.className = "data-set";

    let title = document.createElement("div");
    title.className = "type";
    title.appendChild(document.createTextNode(name + " ID"));

    idDiv.appendChild(title);

    let entry = document.createElement("div");
    entry.className = "value";
    entry.appendChild(document.createTextNode(id.toString()));

    idDiv.appendChild(entry);

    const beforeIds = document.getElementsByClassName("data-set")[0];
    document.getElementsByClassName("data")[0].insertBefore(idDiv, beforeIds);
}