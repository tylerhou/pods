using Newtonsoft.Json;
using SoundCloud.API.Client.Internal.Objects.Interfaces;

namespace SoundCloud.API.Client.Internal.Objects
{
    internal class TrackCollection : IEntityCollection<Track>
    {
        public TrackCollection()
        {
            Collection = new Track[0];
        }

        [JsonProperty(PropertyName = "collection", NullValueHandling = NullValueHandling.Ignore)]
        public Track[] Collection { get; set; }
    }
}
