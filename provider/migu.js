const cache = require('../cache')
const crypto = require('../crypto')
const request = require('../request')

let headers = {
	'origin': 'http://music.migu.cn/',
	'referer': 'http://music.migu.cn/'
}

const search = info => {
	let url =
		'http://m.music.migu.cn/migu/remoting/scr_search_tag?' +
		'keyword=' + encodeURIComponent(info.keyword) + '&type=2&rows=20&pgc=1'

	return request('GET', url)
	.then(response => response.json())
	.then(jsonBody => {
		if('musics' in jsonBody)
			return jsonBody.musics[0].copyrightId
		else
			return Promise.reject()
	})
}

const track = id => {
	let url =
		'http://music.migu.cn/v3/api/music/audioPlayer/getPlayInfo?' +
		'dataType=2&' + crypto.miguapi.encrypt({copyrightId: id.toString()})

	return request('GET', url, headers)
	.then(response => response.json())
	.then(jsonBody => {
		let playInfo = [/*'sqPlayInfo'*/, 'hqPlayInfo', 'bqPlayInfo'].find(key => (key in jsonBody.data) && jsonBody.data[key].playUrl)
		if(playInfo)
			return encodeURI(jsonBody.data[playInfo].playUrl)
		else
			return Promise.reject()
	})
}

const check = info => cache(search, info).then(track)

module.exports = {check}