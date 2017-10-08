using Android.App;
using Android.Widget;
using Android.OS;
using Android.Runtime;
using Android.Content;
using System.Collections.Generic;
using System;

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

			m_br = new StreamAudio.SongDoneReceiver();
			m_br.MainAct = this;

			m_tracks = new JavaList<Track>();

			ListView trackList = FindViewById<ListView>(Resource.Id.TrackList);
			TrackListArrayAdapter adapter = new TrackListArrayAdapter(this, m_tracks);
			trackList.Adapter = adapter;
			trackList.ItemClick += async (sender, e) =>
			{
				Show_Dialog diag = new Show_Dialog(this);
				Show_Dialog.MessageResult result = await diag.ShowDialog("", "Delete this track?", false, false, Show_Dialog.MessageResult.YES, Show_Dialog.MessageResult.NO);
				if (result == Show_Dialog.MessageResult.YES)
				{
					m_tracks.RemoveAt(e.Position);
					m_upd.SendToServer(m_tracks);
					RefreshTracklist();
					bool wasPlaying = Services.StreamingBackgroundService.IsPlaying;
					HandleMusicAction(Services.StreamingBackgroundService.ActionStop, m_tracks);
					if (wasPlaying) PlayIfSongAvailable();
				}
			};

			Button addTrack = FindViewById<Button>(Resource.Id.AddTrack);
			addTrack.Click += (sender, e) =>
			{
				Intent addTrackIntent = new Intent(this, typeof(AddTrackActivity));
				addTrackIntent.PutStringArrayListExtra("BASE_URL", new string[] { m_baseurl});
				StartActivity(addTrackIntent);
			};

			Button play = FindViewById<Button>(Resource.Id.Play);
			play.Click += (sender, e) => PlayIfSongAvailable();
			Button pause = FindViewById<Button>(Resource.Id.Pause);
			pause.Click += (sender, e) => HandleMusicAction(Services.StreamingBackgroundService.ActionPause, m_tracks);
			Button stop = FindViewById<Button>(Resource.Id.Stop);
			stop.Click += (sender, e) => HandleMusicAction(Services.StreamingBackgroundService.ActionStop, m_tracks);

			m_baseurl = "http://10.142.9.106/";
			m_upd = new TrackListUpdater(m_baseurl + "cgi-bin/getpage.cgi");
			m_upd.Update(m_tracks);

			RegisterReceiver(m_br, new IntentFilter("PlaylistSyncClientAndroid.Services.SONG_IS_DONE"));

			var timer = new System.Threading.Timer((e) =>
			{
				string old_url = "";
				if (m_tracks.Count > 0)
				{
					old_url = m_tracks[0].Url;
				}
				m_upd.Update(m_tracks);
				if (m_tracks.Count > 0)
				{
					if (old_url != m_tracks[0].Url && Services.StreamingBackgroundService.IsPlaying)
					{
						HandleMusicAction(Services.StreamingBackgroundService.ActionStop, m_tracks);
						PlayIfSongAvailable();
					}
				}
				else
				{
					HandleMusicAction(Services.StreamingBackgroundService.ActionStop, m_tracks);
				}
				if (Services.StreamingBackgroundService.IsPlaying)
				{
					Track t = m_tracks[0];
					t.NowPlaying = "▶ ";
					m_tracks[0] = t;
				}
				m_upd.SendToServer(m_tracks);
				RefreshTracklist();
			}, null, 1000, 1000);
		}

		private void PlayIfSongAvailable()
		{
			if (m_tracks.Count > 0)
			{
				Track t = m_tracks[0];
				t.NowPlaying = "▶ ";
				m_tracks[0] = t;
				m_upd.SendToServer(m_tracks);
				HandleMusicAction(Services.StreamingBackgroundService.ActionPlay, m_tracks);
			}
		}

		private void HandleMusicAction(string action, IList<Track> tracks)
		{
			if (action != Services.StreamingBackgroundService.ActionPlay && m_tracks.Count > 0)
			{
				Track t = m_tracks[0];
				t.NowPlaying = "";
				m_tracks[0] = t;
				m_upd.SendToServer(m_tracks);
			}
			var intent = new Intent(action);
			if (tracks.Count > 0) intent.PutExtra("Stream_Url", tracks[0].Url);
			intent.SetPackage(this.PackageName);
			StartService(intent);
			RefreshTracklist();
		}

		public void StartNextSong()
		{
			if (m_tracks.Count > 0)
			{
				m_tracks.RemoveAt(0);
				PlayIfSongAvailable();
			}
			m_upd.SendToServer(m_tracks);
			RefreshTracklist();
		}

		private void RefreshTracklist()
		{
			this.RunOnUiThread(() =>
			{
				ListView trackList = FindViewById<ListView>(Resource.Id.TrackList);
				trackList.PostInvalidate();
				trackList.Invalidate();
				trackList.InvalidateViews();
			});
		}

		private IList<Track> m_tracks;
		private TrackListUpdater m_upd;
		private StreamAudio.SongDoneReceiver m_br;
		private string m_baseurl;
	}
}

