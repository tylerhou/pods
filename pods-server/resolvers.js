const pods = [{
  id: 0,
  name: 'testing',
  songs: [],
}]
let nextPodId = 1;
let nextSongId = 0;

export const resolvers = {
  Query: {
    pods: () => {
      return pods;
    },
  },
  Mutation: {
    addPod: (root, args) => {
      const pod = { id: nextPodId++, name: args.name, songs: [] };
      pods.push(pod);
      return pod;
    },
    addSong: (root, args) => {
      const song = { id: nextSongId++, track_url: args.track_url };
      const pod = pods.find(pod => pod.id == args.pod_id);
      console.log(pods, args);
      pod.songs.push(song);
      return song;
    },
  },
  Song: {
    __resolveType: (obj, context) => 'SoundCloudSong'
  },
};

export default resolvers;
