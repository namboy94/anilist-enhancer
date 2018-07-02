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

document.root = null;
var anilistId = 1;
var malId = getMalId(anilistId);
var malUrl = "https://myanimelist.net/anime/" + malId
console.log(malUrl)

function getMalId(anilistId) {

	var query = `
		query ($id: Int) {
		  Media (id: $id, type: ANIME) {
		    idMal
		  }
		}
	`;
	var variables = {id: anilistId}

	var url = 'https://graphql.anilist.co';
	var options = {
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

	return  fetch(url, options)
	   .then(function(response) {
	   		return response.json();
	   })
	   .then(function(json) {
	   		return json["data"]["Media"]["idMal"]
	   });
}
