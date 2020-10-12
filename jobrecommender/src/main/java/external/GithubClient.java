package external;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import entity.Item;

public class GithubClient {
	private static final String URL_TEMPLATE = "https://jobs.github.com/positions.json?description=%s&lat=%s&long=%s";
	private static final String DEFAULT_KEYWORD = "developer";

	public List<Item> search(double lat, double lon, String keyword) {
		// handle input corner case:
		if (keyword == null) {
			keyword = DEFAULT_KEYWORD;
		}
		try {
			keyword = URLEncoder.encode(keyword, "UTF-8"); // ' ' --> '+'; '+' -> %2B
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		// create the url for request call
		String url = String.format(URL_TEMPLATE, keyword, lat, lon);

		// create the http client and http get
		CloseableHttpClient httpclient = HttpClients.createDefault();
		HttpGet httpget = new HttpGet(url);

		// response handler
		ResponseHandler<List<Item>> responseHandler = new ResponseHandler<List<Item>>() {
			@Override
			public List<Item> handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
				int status = response.getStatusLine().getStatusCode();
				// case 1 -- fail
				if (status != 200) {
					return new ArrayList<>(); // no searching result
				}
				// get entity -- message body
				HttpEntity entity = response.getEntity();
				// case 2 -- no searching result
				if (entity == null) {
					return new ArrayList<>();
				}
				// case 3 -- get searching result in string format
				String responseBody = EntityUtils.toString(entity); // what we get is response body string in JSON
																	// format
				JSONArray array = new JSONArray(responseBody); // string to json array object
				return getItemList(array);
			}
		};

		try {
			List<Item> itemList = httpclient.execute(httpget, responseHandler);
			return itemList;
		} catch (Exception e) { // include: IOException, ClientProtocolException
			e.printStackTrace();
		}
		return new ArrayList<>();
	}

	private List<Item> getItemList(JSONArray array) {
		List<Item> itemList = new ArrayList<>();
		// Extract Keywords
		// collect text from description or title
		List<String> descriptionList = new ArrayList<>();
		for (int i = 0; i < array.length(); i++) {
			String description = getStringFieldOrEmpty(array.getJSONObject(i), "description");
			if (description.equals("") || description.equals("\n")) {
				descriptionList.add(getStringFieldOrEmpty(array.getJSONObject(i), "title"));
			} else {
				descriptionList.add(description);
			}
		}
		// call MonkeyLearn to get keywords
		List<List<String>> keywords = MonkeyLearnClient
				.extractKeywords(descriptionList.toArray(new String[descriptionList.size()]));

		for (int i = 0; i < array.length(); i++) {
			JSONObject object = array.getJSONObject(i);
			Item item = Item.builder().itemId(getStringFieldOrEmpty(object, "id"))
					.name(getStringFieldOrEmpty(object, "title")).address(getStringFieldOrEmpty(object, "location"))
					.url(getStringFieldOrEmpty(object, "url")).imageUrl(getStringFieldOrEmpty(object, "company_logo"))
					.keywords(new HashSet<String>(keywords.get(i))).build();
			itemList.add(item);
		}
		return itemList;
	}

	private String getStringFieldOrEmpty(JSONObject obj, String field) {
		// if key does not exist in the jsonObj -> "" otherwise, the corresponding value
		// in the json with the key
		return obj.isNull(field) ? "" : obj.getString(field);
	}
}
