// url of where to download the video from server
const url = "49.235.101.153"

<button onclick="download_video()">refresh</button>

function download_video(url, element_id){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var urlCreator = window.URL || window.webkitURL;
      var video_url = urlCreator.createObjectURL(this.response);
      element.href = video_url;
    };
    xhr.onerror = err => {
      alert('Failed to download picture');
    };
    xhr.send();
}


