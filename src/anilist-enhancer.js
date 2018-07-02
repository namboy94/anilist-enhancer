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

displayMyanimelistData(getAnilistId(), getAnilistType());

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
                    displayMalButton(malId)
                }
            }
        })
        .catch(function handleError(error) {
            console.error(error);
        });
}


/**
 * Shows the myanimelist button on the side bar
 * @param malId {Number} The myanimelist ID
 */
function displayMalButton(malId) {
    const malUrl = "https://myanimelist.net/anime/" + malId;
    const malImg = "https://pbs.twimg.com/profile_images/926302376738377729/SMlpasPv.jpg";

    let div = document.createElement("div");
    div.style.textAlign = "center";
    div.style.background = "rgb(var(--color-foreground))";
    // div.style.marginBottom = "15px";

    let a = document.createElement("a");
    a.href = malUrl;

    let img = document.createElement('img');
    img.src = malImg;
    img.width = 50;
    img.height = 50;
    img.className = "ranking";

    a.appendChild(img);
    div.appendChild(a);

    const first = document.getElementsByClassName("rankings")[0];
    document.getElementsByClassName("sidebar")[0].insertBefore(div, first);
}
