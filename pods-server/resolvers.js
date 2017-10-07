const pods = [{
  id: 0,
  name: 'testing',
  songs: [],
}]
let nextPodId = 1;
let nextSongId = 0;

const getPodById = id => pods.find(pod => pod.id == id);

export const resolvers = {
  Query: {
    pods: () => {
      return pods;
    },
    pod: (root, args) => {
      return getPodById(args.id);
    }
  },
  Mutation: {
    addPod: (root, args) => {
      const pod = { id: nextPodId++, name: args.name, songs: [] };
      pods.push(pod);
      return pod;
    },
    addSong: (root, args) => {
      const song = { id: nextSongId++, track_url: args.track_url };
      const pod = getPodById(args.pod_id)
      pod.songs.push(song);
      return song;
    }
  },
  Song: {
    __resolveType: (obj, context) => 'SoundCloudSong'
  },
};

export default resolvers;
