import {useEffect} from "react";
/* TODO
  -non hardcoded url
  -security,https for video
  -programatically set video type
  -generic poster
  -generic fallback link

recall i have vid streaming working:
  <source src="http://192.168.40.8:3000/video" type="video/mp4" />
*/

export default function Home() {
  // TODO - replace dom calls w/ refs
  // https://react.dev/learn/manipulating-the-dom-with-refs
  // and next section too
  useEffect(() => {
    const video = document.getElementById('video')
    
    // check if the browser supports <video>
    if (video.canPlayType) {
      // setup custom video controls
      const videoContainer = document.getElementById('videoContainer')
      const videoControls = document.getElementById('video-controls')
    
      // disable browser's default controls
      video.controls = false
    
      // display user defined video controls
      videoControls.style.display = 'block'

      const playPause = document.getElementById("play-pause")
      const stop = document.getElementById("stop")
      const mute = document.getElementById("mute")
      const volInc = document.getElementById("vol-inc")
      const volDec = document.getElementById("vol-dec")
      const progress = document.getElementById("progress")
      const fullscreen = document.getElementById("fs")

      // hide fullscreen buttoon if fullscreen api not enabled
      if (!document?.fullscreenEnabled) fullscreen.style.display = 'none'

      function alterVolume(dir) {
        const currentVolume = Math.floor(video.volume * 10) / 10

        if (dir === '+' && currentVolume < 1) video.volume += 0.1
        else if (dir === '-' && currentVolume > 0) video.volume -= 0.1
      }

      function setFullscreenData(state) {
        videoContainer.setAttribute('data-fullscreen', !!state)
      }

      playPause.addEventListener('click', e => {
        if (video.paused || video.ended) video.play()
        else video.pause()
      })

      stop.addEventListener('click', e => {
        video.pause()
        video.currentTime = 0
        progress.value = 0
      })

      mute.addEventListener('click', e => {
        video.muted = !video.muted
      })

      volInc.addEventListener('click', e => {
        alterVolume('+')
      })
      
      volDec.addEventListener('click', e => {
        alterVolume('-')
      })

      video.addEventListener('loadedmetadata', () => {
        // set the progress bar's maximum value (length of video)
        // duration available for read on loadedmetadata event
        progress.setAttribute('max', video.duration)
      })

      video.addEventListener('progress', () => {
        const duration = video.duration
        const bufferedAmount = document.getElementById('buffered-amount')
        if (duration > 0) {
          for (let i = 0; i < video.buffered.length; i++) {
            if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
              bufferedAmount.style.width = `${(video.buffered.end(video.buffered.length - 1 - i) * 100) / duration}%`
              break;
            }
          }
        }
      })

      video.addEventListener("timeupdate", () => {
        // some mobile browsers don't update loadedmatadata like desktop browsers
        // video duration set at this point in most mobile browsers
        if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration)

        progress.value = video.currentTime;

        // TODO-will need to add this feature to the reagular video progress bar. 'media buffering, seeking and ranges has jsbin.com code to see examples
        // progress bar on available to play
        if (video.duration > 0)
          document.getElementById('buffered-progress-amount').style.width = `${(video.currentTime / video.duration) * 100}%`
      })

      // Add skip ahead
      progress.addEventListener('click', e => {
        const rect = progress.getBoundingClientRect()
        const pos = (e.pageX - rect.left) / progress.offsetWidth
        video.currentTime = pos * video.duration
      })

      fullscreen.addEventListener('click', e => {
        if (document.fullscreenElement !== null) { // in fullscreen mode
          document.exitFullscreen()
          setFullscreenData(false)
        } else {
          videoContainer.requestFullscreen()
          setFullscreenData(true)
        }
      })

      document.addEventListener('fullscreenchange', e => {
        setFullscreenData(!!document.fullscreenElement)
      })
    }
  }, [])

// <source src="/big_buck_bunny_720p_surround.mp4" type="video/mp4" />
  return (
    <figure id="videoContainer">
      <video
        id="video"
        controls
        width="620"
        poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
        preload="none"
      >
        <source src="http://192.168.40.8:3001/v1/video_stream" type="video/webm" />
  
        have other fallbacks w/ different media types of video, ex: .ogg
        fallback:<a href="https://archive.org/details/BigBuckBunny_124">here</a>.
      </video>
      <ul id="video-controls" class="controls">
        <li class="progress">
          <progress id="progress" value="0" min="0" />
        </li>
        <li>
          <div class="buffered">
            <span id="buffered-amount"></span>
          </div>
          <div class="buffered-progress">
            <span id="buffered-progress-amount"></span>
          </div>
        </li>
        <li><button id="play-pause" type="button">Play/Pause</button></li>
        <li><button id="stop" type="button">Stop</button></li>
        <li><button id="mute" type="button">Mute/Unmute</button></li>
        <li><button id="vol-inc" type="button">Vol+</button></li>
        <li><button id="vol-dec" type="button">Vol-</button></li>
        <li><button id="fs" type="button">Fullscreen</button></li>
      </ul>
      <figcaption>
        &copy; mozilla
      </figcaption>
    </figure>
  );
}
