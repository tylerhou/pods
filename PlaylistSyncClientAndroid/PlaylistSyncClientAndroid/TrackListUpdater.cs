using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

using GraphQL;
using GraphQL.Types;

namespace PlaylistSyncClientAndroid
{
	class TrackListUpdater
	{
		public TrackListUpdater()
		{
			schema = (
@"type SoundCloudSong {
id: ID!
	track_url: String!
}

union Song = SoundCloudSong

type Pod {
	id: ID!
	name: String!
	songs: [Song]
}

type Query {
	pods: [Pod]
	pod(id: ID!): Pod
}

type Mutation {
	addPod(name: String!): Pod
	addSong(pod_id: ID!, track_url: String!): Song
}");
		}
		private string schema;
	}
}