using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

using GraphQL;

namespace PlaylistSyncClientAndroid
{
	class TrackListUpdater
	{
		public TrackListUpdater(string url)
		{
			this.m_url = url;
		}

		public void Update(IList<Track> tracks)
		{
			WebRequest req = WebRequest.Create(m_url);
			WebResponse resp = req.GetResponse();
			StreamReader reader = new StreamReader(resp.GetResponseStream());
			string data = reader.ReadToEnd();
			string[] songs = data.Split('\n');
			tracks.Clear();
			foreach (string song in songs)
			{
				if (song == "") continue;
				Track t;
				string[] song_data = song.Split('\\');
				t.Name = song_data[0];
				t.Url = song_data[1];
				t.Length = song_data[2];
				tracks.Add(t);
			}
			resp.Close();
		}

		public void SendToServer(IList<Track> tracks)
		{
			string data = "";
			foreach (Track track in tracks)
			{
				data += track.Name;
				data += '\\';
				data += track.Url;
				data += '\\';
				data += track.Length;
				data += '\n';
			}
			if (data.Length > 0) data = data.Substring(0, data.Length - 1);
			string request_url = m_url + "?data=" + WebUtility.UrlEncode(data);
			WebRequest req = WebRequest.Create(request_url);
			WebResponse resp = req.GetResponse();
			StreamReader reader = new StreamReader(resp.GetResponseStream());
			resp.Close();
		}

		private string m_url;
	}
}