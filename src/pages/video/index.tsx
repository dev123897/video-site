import {useEffect,useRef} from "react";

/* TODO
  -non hardcoded url
  -security,https for video
  -programatically set video type
  -generic poster
  -generic fallback link
  -do we really want stop to reset video progress back to start?

recall i have vid streaming working:
  <source src="http://192.168.40.8:3000/video" type="video/mp4" />
*/

export default function Home() {
  const video = useRef<HTMLVideoElement>(null)
  const bufferedProgressAmount = useRef<HTMLSpanElement>(null)
  const playPause = useRef<HTMLButtonElement>(null)
  const stop = useRef<HTMLButtonElement>(null)
  const mute = useRef<HTMLButtonElement>(null)
  const volInc = useRef<HTMLButtonElement>(null)
  const volDec = useRef<HTMLButtonElement>(null)
  const progress = useRef<HTMLProgressElement>(null)
  const fullscreen = useRef<HTMLButtonElement>(null)
  const bufferedAmount = useRef<HTMLSpanElement>(null)

  // setup custom video controls
  const videoControls = useRef<HTMLUListElement>(null)
  const videoContainer = useRef<HTMLElement>(null)

  useEffect(() => {
    // check if the browser supports <video>
    if (video.current!.canPlayType) {
      // disable browser's default controls
      video.current!.controls = false

      // display user defined video controls
      videoControls.current!.style.display = 'block'

      // hide fullscreen buttoon if fullscreen api not enabled
      if (!document?.fullscreenEnabled) fullscreen.current!.style.display = 'none'

      function alterVolume(dir: string) {
        const currentVolume = Math.floor(video.current!.volume * 10) / 10

        if (dir === '+' && currentVolume < 1) video.current!.volume += 0.1
        else if (dir === '-' && currentVolume > 0) video.current!.volume -= 0.1
      }

      function setFullscreenData(state: Boolean) {
        videoContainer.current!.setAttribute('data-fullscreen', (!!state).toString()) // TODO-i dont want to remove !! until its in its own commit
      }

      playPause.current!.addEventListener('click', e => {
        if (video.current!.paused || video.current!.ended) video.current!.play()
        else video.current!.pause()
      })

      stop.current!.addEventListener('click', e => {
        video.current!.pause()
        video.current!.currentTime = 0
        progress.current!.value = 0
      })

      mute.current!.addEventListener('click', e => {
        video.current!.muted = !video.current!.muted
      })

      volInc.current!.addEventListener('click', e => {
        alterVolume('+')
      })

      volDec.current!.addEventListener('click', e => {
        alterVolume('-')
      })

      video.current!.addEventListener('loadedmetadata', () => {
        // set the progress bar's maximum value (length of video)
        // duration available for read on loadedmetadata event
        progress.current!.setAttribute('max', video.current!.duration.toString())
      })

      video.current!.addEventListener('progress', () => {
        const duration = video.current!.duration

        if (duration > 0) {
          for (let i = 0; i < video.current!.buffered.length; i++) {
            if (video.current!.buffered.start(video.current!.buffered.length - 1 - i) < video.current!.currentTime) {
              bufferedAmount.current!.style.width = `${(video.current!.buffered.end(video.current!.buffered.length - 1 - i) * 100) / duration}%`
              break;
            }
          }
        }
      })

      video.current!.addEventListener("timeupdate", () => {
        // some mobile browsers don't update loadedmatadata like desktop browsers
        // video duration set at this point in most mobile browsers
        if (!progress.current!.getAttribute('max')) progress.current!.setAttribute('max', video.current!.duration.toString())

        progress.current!.value = video.current!.currentTime;

        // TODO-will need to add this feature to the reagular video progress bar. 'media buffering, seeking and ranges has jsbin.com code to see examples
        // progress bar on available to play
        if (video.current!.duration > 0)
          bufferedProgressAmount.current!.style.width = `${(video.current!.currentTime / video.current!.duration) * 100}%`
      })

      // Add skip ahead
      progress.current!.addEventListener('click', e => {
        const rect = progress.current!.getBoundingClientRect()
        const pos = (e.pageX - rect.left) / progress.current!.offsetWidth
        video.current!.currentTime = pos * video.current!.duration
      })

      fullscreen.current!.addEventListener('click', e => {
        if (document.fullscreenElement !== null) { // in fullscreen mode
          document.exitFullscreen()
          setFullscreenData(false)
        } else {
          videoContainer.current!.requestFullscreen()
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
    <figure id="videoContainer" ref={videoContainer}>
      <video
        id="video"
        ref={video}
        controls
        width="620"
        poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
        preload="none"
      >
        <source src="http://192.168.40.8:3001/v1/video_stream" type="video/webm" />

        have other fallbacks w/ different media types of video, ex: .ogg
        fallback:<a href="https://archive.org/details/BigBuckBunny_124">here</a>.
      </video>
      <ul id="video-controls" ref={videoControls} className="controls">
        <li className="progress">
          <progress id="progress" ref={progress} value="0" min="0" />
        </li>
        <li>
          <div className="buffered">
            <span id="buffered-amount" ref={bufferedAmount} ></span>
          </div>
          <div className="buffered-progress">
            <span id="buffered-progress-amount" ref={bufferedProgressAmount}></span>
          </div>
        </li>
        <li><button id="play-pause" ref={playPause} type="button">Play/Pause</button></li>
        <li><button id="stop" ref={stop} type="button">Stop</button></li>
        <li><button id="mute" ref={mute} type="button">Mute/Unmute</button></li>
        <li><button id="vol-inc" ref={volInc} type="button">Vol+</button></li>
        <li><button id="vol-dec" ref={volDec} type="button">Vol-</button></li>
        <li><button id="fs" ref={fullscreen} type="button">Fullscreen</button></li>
      </ul>
      <figcaption>
        &copy; mozilla
      </figcaption>
    </figure>
  );
}
