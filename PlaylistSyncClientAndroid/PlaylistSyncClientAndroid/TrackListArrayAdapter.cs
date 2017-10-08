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
using Java.Lang;

namespace PlaylistSyncClientAndroid
{
	class TrackListArrayAdapter : Android.Widget.BaseAdapter
	{
		public TrackListArrayAdapter(Activity ctx, IList<Track> tracks)
		{
			m_ctx = ctx;
			m_tracks = tracks;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			View view = convertView;
			if (view == null) {
				view = m_ctx.LayoutInflater.Inflate(Android.Resource.Layout.SimpleExpandableListItem2, null);
			}
			TextView text1 = (TextView)view.FindViewById(Android.Resource.Id.Text1);
			TextView text2 = (TextView)view.FindViewById(Android.Resource.Id.Text2);

			text1.Text = m_tracks[position].NowPlaying + m_tracks[position].Name;
			text2.Text = m_tracks[position].Length;
			return view;
		}

		public override Java.Lang.Object GetItem(int position)
		{
			return null;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		private IList<Track> m_tracks;
		private Activity m_ctx;

		public override int Count
		{
			get
			{
				return m_tracks.Count;
			}
		}
	}
}