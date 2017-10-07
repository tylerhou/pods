using Android.App;
using Android.Widget;
using Android.OS;
using Android.Runtime;
using Android.Content;
using System.Collections.Generic;

namespace PlaylistSyncClientAndroid
{
	[Activity(Label = "PlaylistSyncClientAndroid", MainLauncher = true, Icon = "@drawable/icon")]
	public class MainActivity : Activity
	{
		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			// Set our view from the "main" layout resource
			SetContentView (Resource.Layout.Main);


			JavaList<string> names = new JavaList<string> { "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "ccc" };
			JavaList<string> lengths = new JavaList<string> { "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "aaa", "bbb", "ccc" };
			JavaList<Track> tracks = new JavaList<Track>();
			for (int i = 0; i < names.Size(); ++i)
			{
				Track t;
				t.Name = names[i];
				t.Length = lengths[i];
				tracks.Add(t);
			}

			ListView trackList = FindViewById<ListView>(Resource.Id.TrackList);
			TrackListArrayAdapter adapter = new TrackListArrayAdapter(this, tracks);
			trackList.Adapter = adapter;

			Button play = FindViewById<Button>(Resource.Id.Play);
			play.Click += (sender, e) => HandleMusicAction(Services.StreamingBackgroundService.ActionPlay);
			Button pause = FindViewById<Button>(Resource.Id.Pause);
			pause.Click += (sender, e) => HandleMusicAction(Services.StreamingBackgroundService.ActionPause);
			Button stop = FindViewById<Button>(Resource.Id.Stop);
			stop.Click += (sender, e) => HandleMusicAction(Services.StreamingBackgroundService.ActionStop);
		}

		private void HandleMusicAction(string action)
		{
			var intent = new Intent(action);
			StartService(intent);
		}
	}
}

