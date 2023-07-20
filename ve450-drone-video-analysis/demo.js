// url of where to download the video from server
let server_url = "http://49.235.101.153:5000/video/";
let window_size = 5;
let fetch_interval = 1

let video_component = document.getElementById("live-video");
let start_time = get_time();
let video_window = [];
let curr_video_url = null;

for (var i = 0; i < window_size; i++) {
    video_window.push({time : start_time - window_size + i, url : null});
}

// setInterval(swap_video, 1000);
// function swap_video()
// {
//     let time = get_time();
//     console.log(time);
//     if (time % 2 == 0) {
//         video_component.src = "files/original.mp4";
//     }
//     else {
//         video_component.src = "files/YOLO.mp4";
//     }
// }

setInterval(try_fetch_video, fetch_interval * 1000)
setInterval(try_move_window, 1000)

function try_move_window()
{
    let time = get_time();
    while (video_window[0].time < time - window_size + 1) {
        let video_to_play = video_window.shift();
        video_window.push({time : time, url : null});

        if (video_to_play.url !== null) {
            if (curr_video_url !== null) {
                URL.revokeObjectURL(curr_video_url);
            }
            video_component.src = video_to_play.url;
            curr_video_url = video_to_play.url;
            console.log(`Playing video ${video_to_play.time}, url: ${
                video_to_play.url}`)
        }
    }
}

function try_fetch_video()
{
    for (let i = 0; i < window_size; i++) {
        if (video_window[i].url === null) {
            let video_url = `${server_url}?id=${video_window[i].time}`;
            console.log(video_url)
            fetch(video_url).then(response => response.blob()).then(blob => {
                if (video_window[i].url === null) {
                    let object_url = URL.createObjectURL(blob)
                    video_window[i].url = object_url;
                    console.log(`Fetched video ${video_window[i].time}, url: ${
                        object_url}`);
                }
            })
        }
    }
}

function get_time() { return Math.floor(Date.now() / 1000); }
// function download_video(url, element_id)
// {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'blob';
//     xhr.onload = function() {
//         var urlCreator = window.URL || window.webkitURL;
//         var video_url = urlCreator.createObjectURL(this.response);
//         element.href = video_url;
//     };
//     xhr.onerror = err => { alert('Failed to download picture'); };
//     xhr.send();
// }
