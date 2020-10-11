package db;

public class MySQLDBUtil {
	private static final String INSTANCE = "laiproject-instance.ce2drcapvran.us-east-2.rds.amazonaws.com";
	private static final String PORT_NUM = "3306";
	private static final String DB_NAME = System.getenv("RDS_DATABASE");
	private static final String USERNAME = System.getenv("RDS_USERNAME");
	private static final String PASSWORD = System.getenv("RDS_PASSWORD");
	public static final String URL = "jdbc:mysql://" + INSTANCE + ":" + PORT_NUM + "/"
			                          + DB_NAME + "?user=" + USERNAME + "&password=" + PASSWORD
			                          + "&autoReconnect=true&serverTimezone=UTC";
}
