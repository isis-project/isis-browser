#
# Regular cron jobs for the isisbrowser package
#
0 4	* * *	root	[ -x /usr/bin/isisbrowser_maintenance ] && /usr/bin/isisbrowser_maintenance
