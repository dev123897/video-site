const thumbnail = 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217'
const link = "/video"

const videoLinks = [
  { link, title: 'one', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
  { link, title: 'two', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
  { link, title: 'three', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
  { link, title: 'four', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
  { link, title: 'five', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
  { link, title: 'six', thumbnail, channel: 'default', views: 0, age: '1 year ago' },
]

export default function Feed() {
  return (
    <ul>
      {videoLinks.map(vid =>
        <li>
          <a href={vid.link}>
            <img src={vid.thumbnail} height="300" width="300" />
          </a>
          {vid.title}
          {vid.channel} - {vid.views}
          {vid.age}
        </li>)}
    </ul>
  );
}
