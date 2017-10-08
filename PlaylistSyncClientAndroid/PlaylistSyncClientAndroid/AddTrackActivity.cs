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

namespace PlaylistSyncClientAndroid
{
	[Activity(Label = "AddTrackActivity")]
	public class AddTrackActivity : Activity
	{
		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			m_baseurl = Intent.GetStringArrayListExtra("BASE_URL")[0];
			m_upd = new TrackListUpdater(m_baseurl + "static/songlist.dat");

			// Create your application here
			SetContentView(Resource.Layout.AddTrack);

			ListView trackToAdd = FindViewById<ListView>(Resource.Id.AddTrackList);
			m_tracks = new JavaList<Track>();
			m_upd.Update(m_tracks);
			TrackListArrayAdapter adapter = new TrackListArrayAdapter(this, m_tracks);
			trackToAdd.Adapter = adapter;
			trackToAdd.ItemClick += (sender, e) =>
			{
				IList<Track> original_tracklist = new JavaList<Track>();
				TrackListUpdater original_upd = new TrackListUpdater(m_baseurl + "cgi-bin/getpage.cgi");
				original_upd.Update(original_tracklist);
				Track t = m_tracks[e.Position];
				original_tracklist.Add(t);
				original_upd.SendToServer(original_tracklist);
				this.Finish();
			};

			Button cancel = FindViewById<Button>(Resource.Id.CancelAddTrack);
			cancel.Click += (sender, e) =>
			{
				this.Finish();
			};
		}

		private IList<Track> m_tracks;
		private string m_baseurl;
		private TrackListUpdater m_upd;
	}
}