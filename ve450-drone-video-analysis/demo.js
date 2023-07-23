// url of where to download the video from server
let server_url = "http://127.0.0.1:5000/video/";
let window_size = 6
let fetch_interval = 1
let move_detech_interval = 0.1

let video_component = document.getElementById("live-video");
let video_src_component1 = document.getElementById("live-video-src1");
let video_src_component2 = document.getElementById("live-video-src2");
let start_time = get_time() - window_size
let video_window = {};
let curr_video_url = null;

for (let i = 0; i < window_size; i++) {
    video_window[start_time + i] = null
}

setInterval(try_fetch_video, fetch_interval * 1000)
setInterval(try_move_window, move_detech_interval * 1000)

function try_move_window()
{
    let time = get_time();
    while (start_time < time - window_size + 1) {
        let video_to_play = video_window[start_time]
        video_window[start_time + window_size] = null
        start_time++
        console.log(`New window: ${video_window}`)

        if (video_to_play !== null)
        {
            if (video_src_component2.src !== null) {
                URL.revokeObjectURL(curr_video_url);
            }
            // video_component.pause()
            video_src_component2.setAttribute("src", video_src_component1.src)
            video_src_component1.setAttribute("src", video_to_play)
            video_component.load()
            video_component.play()
            // video_component.src = video_to_play
            curr_video_url = video_to_play;
            console.log(
                `Playing video ${start_time - 1}, url: ${video_to_play}`)
        }
    }
}

function try_fetch_video()
{
    for (let i = 0; i < window_size; i++) {
        let time = start_time + i;
        if (video_window[time] === null) {
            let video_url = `${server_url}?id=${time}`;
            console.log(video_url)
            fetch(video_url)
                .then(response => response.blob())
                .then(blob => {
                    if (video_window[time] === null) {
                        let object_url = URL.createObjectURL(blob)
                        video_window[time] = object_url
                        console.log(
                            `Fetched video ${time}, url: ${object_url}`);
                    }
                })
                .catch(error => {})
        }
    }
}

function get_time() { return Math.floor(Date.now() / 1000); }