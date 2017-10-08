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

namespace PlaylistSyncClientAndroid.StreamAudio
{
	public class SongDoneReceiver : BroadcastReceiver
	{
		public SongDoneReceiver() : base()
		{
		}

		public override void OnReceive(Context context, Intent intent)
		{
			if (intent.Action == "PlaylistSyncClientAndroid.Services.SONG_IS_DONE")
			{
				MainAct.StartNextSong();
			}
		}

		public MainActivity MainAct {set; get; }
	}
}