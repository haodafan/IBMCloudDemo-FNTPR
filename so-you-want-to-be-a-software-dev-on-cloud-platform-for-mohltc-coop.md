# SO YOU WANT TO BE A SOFTWARE DEVELOPER ON THE IBM CLOUD AS A COOP INTERN WORKING FOR THE MINISTRY OF HEALTH AND LONG TERM CARE

**By: Haoda Fan (Software developer on a Cloud Platform, Co-op student from the University of Waterloo)**

**December, 2017**

# 1.0 INTRODUCTION
Obligatory introductory hook:

*Welcome to the machine. You are a small cog in the infinitely large and infinitely inefficient engine that is the Ontario Government. To survive, you cannot simply follow the mindless herd. You must rise above the herd, define your own identity, and become your own individual. Become the Ubermensch.*

*Awaken my child. Embrace the glory that is your birthright. Know that I am the Overmind; the eternal will of the Swarm, and you have been created to serve me.*

Since I know you have already decided to follow the Nietzschean philosophy of self-determination, why should you even bother reading this document? Well, as a past intern, I have experienced a set of issues and difficulties that have gotten in the way of my productivity on the cloud, with no real training or mentoring to help me along. This could change in the future, because as of the writing of this document, the cloud is a very new thing for our department, so nobody really knows how to use it. So in order for you to not be stuck on all the things I was stuck on, I have been voluntold to document all the difficulties I had and the things that I have learned while creating my main project, the First Nations' Digital Income Reporting thing.

Anyways, on to cloud development and (hopefully) making your life easier.

# 2.0 PROBLEMS YOU WILL ENCOUNTER AND HOW TO SOLVE ... MOST OF THEM

## 2.1 Administrative Privileges
**Problem**

As a software development intern, you do not have access to administrative priviledges on your computer! This means you will not be able to INSTALL any programs onto your computer, or CHANGE any sensitive data or settings on your computer. Of course, you can still download files from the internet, but when you have to install a new language, or change a PATH variable, then you will not have permission to do so.

**Solution**

To solve this problem, you will need to enlist the help of your manager. If the heavens smile upon you this co-op term, then the ministry might be able to get you administrative priviledges to your own computer upon your request; however, that is unlikely to happen, and it did not happen to me<sup>[1]</sup>. More likely, after a lengthy request process, your manager will most likely have to give admin access to your computer to a trusted coworker.

After he/she gains access to your computer, every time you need administrative priviledges, you will have to ask him/her to login and install or change things for you. It's a bit annoying and inefficient for everyone involved, so its best to first create a list of all the things you know you need an admin to install for you, and get them all ready before your coworker buddy comes to install it for you. That way, you can get the installation done in one (or a few) fell swoop(s), rather than have him/her come over a dozen times to install one thing.

[1] Apparently in the past, software development interns were granted administrative access to their computers, but this priviledge was recently removed for security reasons (I think there was some virus going around?). Anyway, thanks a lot that one intern who probably downloaded a virus, I blame this on you.

## 2.2 The OPS Firewall
**Problem**

The OPS firewall is probably the single most annoying obstacle you will encounter in your first few days or weeks (or if you're me, months) of work. The OPS firewall forbids you from accessing certain websites (such as YouTube), and denies you the freedom to download and access the web from the command line or through third party applications that aren't browsers (such as Maven). The Ontario Public Service's Great Firewall restricts you to such an extent, that it makes even Fang BinXing jealous<sup>[citation needed]</sup> , and as cloud developers, asking us to work with this firewall is akin to asking a surgeon to perform surgery with his bare hands and blindfolded.

**Solution**

Luckily, us Cloud Developers are much more cunning than the average government grunt. Throughout my ~~reign~~ time here, I have been able to figure out how to bypass this firewall through the clever use of a **proxy**.

### 2.2.1 Setting up a proxy for Apache Maven

If you're programming in Java EE on Eclipse, you may need to use Maven. Unfortunately, if you try to build with Maven without a proxy, Maven will simply return an error when it tries to access and download its resources.

To solve this, go into your .m2 folder (it should be in your user folder), create a new file called 'settings.xml'.

Then, enter the following code:

```xml
<settings>
	<proxies>
	<proxy>
		<id>myproxy</id>
		<active>true</active>
		<protocol>http</protocol>
		<host>204.40.130.129</host>
		<port>3128</port>
		<username></username>
		<password></password>
		<nonProxyHosts>localhost,127.0.0.1</nonProxyHosts>
	</proxy>
	<proxy>
		<id>myhttpsproxy</id>
		<active>true</active>
		<protocol>https</protocol>
		<host>204.40.130.129</host>
		<port>3128</port>
		<nonProxyHosts>localhost,127.0.0.1</nonProxyHosts>
	</proxy>
	</proxies>
</settings>
```
**Note:** If you already have a settings.xml, then simply add the contents inside the <settings></settings> tags.


### 2.2.2 Setting up a proxy for JMeter

If you want to use JMeter to load test a certain web application, you'll need get it over OPS's firewall first, or else it will simply return data essentially saying that the website gave them no response (which makes sense, since JMeter's request wouldn't make it through in the first place).

To accomplish this is very simple. You'll simply need to run JMeter through the **command line** every time you use it, with certain settings. Here is a step-by-step process...

1. Navigate to the folder where JMeter is located.
2. Shift + Right Click on the 'bin' folder
3. Click 'Open command window here'. It should open up command prompt at that location.
4. Enter the following command:
``` jmeter.bat -H 204.40.130.129 -P 3128 -N localhost,127.0.0.1 -u -a ```

With that, JMeter should be running through a proxy server and able to load test any website you desire!


### 2.2.3 Setting up a proxy for Bluemix CLI

If you're building a Node.JS application on IBM Cloud (aka IBM Bluemix), then you'll likely want to do so locally (like in the tutorials). To do so, you'll need to install the Command Line Interface.

First, ask your administratively talented coworker (or whoever has admin rights to your computer) to log in and install it for you. That should ensure it installs properly, and the commands are added to your PATH environment variables.

Unfortunately, for the CLI to connect to IBM's Cloud, you'll need to get past the gates of ~~Mordor~~ OPS's firewall. Here are more step by step instructions. I make learning FUN.

1. Go to your control panel, and look up 'Environment Variables'.
2. Click on 'Edit environment variables for your account'.
3. Under user variables for {whoever you are}, click the 'New...' button.
4. In variable name, enter 'HTTP_PROXY'
5. In variable value, enter '204.40.130.129:3128'
6. Repeats step 3-5, except have the variable be named 'HTTPS_PROXY'
7. With those two new variables added in, click 'OK'.

Now, you should be able to run the Bluemix CLI without any dehabilitating firewall issues.

### 2.2.4 Setting up a proxy for Node and NPM

If you want to get in on the newest ~~fads~~ ~~trends~~ ~~bandwagons~~ technologies in the web development world, you'll need to use Node.JS, and its equally important partner, Node Package Manager (npm). Unfortunately, it uses a command line interface, and like everything else with command lines, the firewall hates it with a passion. Once again, let's set a proxy. Open up the command line, and type the following two commands:

`npm config set proxy http://204.40.130.129:3128`

`npm config set https-proxy https://204.40.130.129:3128`

With these set up, you should be able to run npm commands liberally.

### 2.2.5 Setting up a proxy for Git

In order to use the git command line interface (very useful if you use github or any kind of git-related version control system), you'll need to set a proxy in a very similar fashion to the proxy set for node and npm. Simply enter the following commands:

`git config --global http.proxy http://204.40.130.129:3128`

`git config --global https.proxy https://204.40.130.129:3128`

Now clone and push and pull and merge at will! You're free I say! Free!

### 2.2.6 Setting up a proxy for ... basically anything else

At this point you should kind of get the idea. If whatever thing you're using is being blocked by the OPS firewall, simply look up how to set a proxy for that thing, and use the following information:

* **Host/URL/Whatever (works for both http and https)**: 204.40.130.129
* **Port**: 3128
* (No username, no password)

All the information above was a result of me looking up how to setup proxies for those specific applications and entering that data. I hope the five above sections will save you the trouble of doing it yourself for those in particular.



Anyway, are those cows grazing in the distance I see? Looks like it's time to MOO-ve on ahaha ... (why am I like this)

## 2.3 Node Package Manager Problems
**Problem**
If you use Node.js, or any advanced Javascript framework, then you will definitely want to use Node Package Manager, or npm. After installing node and setting up a proxy for npm (Refer to section 2.2.4), most npm packages can be installed without problem using the command line. Most. Unfortunately, there are some that won't work, namingly '--global' packages and some packages required to run angular and react.

I figured the problem must lie with my (lack of) administrative privileges, so I asked my coworker to run the command line as admin, so that I could install them with the correct priviledges. Unfortunately, that didn't work, because (and this is just speculation, I'm still not sure exactly why it didn't work) logging into his administrative account must have mixed up the command line's installation addresses.

**Solution (or more accurately, workaround) for non global packages**
Unfortunately, I could not find a way to properly get direct command line installations to work for all node packages. Instead, I used a little workaround.

Although your node package manager is not permitted to install everything you want it to at work, that does not mean you can't do it from home. Although it seems kinda dumb, inefficient, and a bit of a 'duct tape' solution, in the end, it worked, and that's all that matters... right?

Here is the step by step process.
1. Write down the package names you need to install.
2. Go home (When your work ends, obviously).
3. Open up node on your personal computer (install it if you don't have it).
5. Create a new node project using 'npm init'.
6. Use 'npm install --save' to install all the necessary components.
7. Take your node_modules folder and your package.json folder, and compress it into a zip or similar
8. Upload the file to Google Docs, or email it to yourself.
9. Go to work (the next day, obviously).
10. Download and unzip your files, and then paste the contents of node_modules into your project folder
11. Open package.json from your downloaded file and copy the "dependencies"
12. Add (paste) the dependencies from your downloaded package.json to your project's package.json
13. Voila! You now have all your necessary node libraries.

**Solution (or more accurately, workaround) for global packages**
Similarily and also unfortunately, I also could not find a way to make this work directly on the work computers as well. The only way I knew to get around this, is that whenever you want to use a global command, to transfer the necessary files to your home computer, install/use the global command from home, and then transfer it back to the work computers. This is highly inefficient, so I either avoid global commands whenever possible, or I bring my home computer (which happens to be a laptop) to work, and use my computer with the wifi downstairs when I needed to. Not exactly an elegant solution, but it worked for me.

**__If you come up with a better solution, then by all means, go ahead and use that. This is just what I have learned worked best for me at the time (with the information I possessed).__**

## 2.4 Debugging on the Cloud

As someone who has never really done work with backend programming before this job, the thing I initially found most frustrating about work on the cloud is debugging. Whenever a portion of my program fails, it would give me an

`Error 500: Internal Server Error`.

Okay... not very helpful, let me just ctrl+shift+I ...

```Error 500 Internal Server Error```

What the ???? How am I supposed to know what's wrong if this is all the info you give me??? ARUGHHHGHHH

I know. I'll just write some console.logs to tell me which parts work and which parts don't. Now, when I go into the browser console...

```Error 500 Internal Server Error```

WHAT??? (╯°□°）╯︵ ┻━┻

So... what now?

 ┬─━┬﻿ ノ(゜-゜ノ)

Turns out, when running any back-end server application, the app will not print its logs or statuses in the browser console. The **browser console** only deals with **client side code**. **Server side logs** are handled by the back-end server console, which in this case, is your **IBM Cloud server**.

You have two ways of retrieving the logs. The first way, the one that I don't like, is through IBM Cloud's web UI, where you can view your logs from there. But IBM's browser-based UI is very slow and the retrieved logs are both hard to read and slow to load.

The better way (in my opinion), is to use the following command in your Command Line Interface:

`cf logs --recent applicationName`

with applicationName being whatever name you gave to your application (in the case of my program, it was demo-fntpr-2). To retrieve logs, I prefer using git bash instead of command prompt, because the font is both smaller and easier to read.


## 2.5 UNSOLVED ISSUES

### 2.4.1 'Proxy Authentication Required'

Even after setting a proxy, every so often, you are once again prevented from accessing the internet via command line because of an error that prompts you to authenticate yourself ("Proxy Authentication Required."). To this day, I still have no idea what causes it. I do know that it usually happens early in the morning (~9AM), at noon, and about an hour or so before I'm supposed to leave (~4pm).

The problem usually goes away after simply waiting 5-10 minutes, although sometimes, this 'authentication required' block can last up to an hour. It's really not good for productivity, but I honestly have no clue what causes it and how to fix it, so I normally just wait it out.

¯\\ _ (ツ) _ /¯

# 3.0 MY CLOUD PROJECT AND HOW I DEVELOPED IT

I spent around 3 weeks developing this project, meant to be a proof-of-concept prototype application for the IBM Cloud. You can find its github [here](http://github.com/haodafan/IBMCloudDemo-FNTPR). The github shows the ReadMe.MD file, which contains some basic information about my project.

My project has several components, which can be considered mini-projects. Since I don't trust myself to be able to code in an easily readable and understandable format, I will go through my development process of each part of those components.

## 3.1 Starting a Node.JS project on Bluemix
I started off my project with [this simple tutorial](https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html).

This tutorial essentially taught me how to setup my development environment, and push a sample application onto Bluemix.

### 3.1.1 manifest.yml
The manifest.yml file contains the metadata for your project (like your project name, your project URL, the services that are used, etc). This file is important, as it tells the IBM Cloud how to run your project.

## 3.2 Using ClearDB (MySQL) with your Node application and the Cloud.

The sample application uses Cloudant, which is a NoSQL database. Now, even though NoSQL databases like Cloudant and MongoDB are currently all the rage, the government and many large corporations prefer to use good old SQL. So, I'll give you a lil lesson on how to use ClearDB, a free MySQL database service, for your Node application.

To create a ClearDB service for IBM Bluemix, simply go to the Catalog, and scroll down to find 'ClearDB for MySQL'.

FFFFFFFFFFFFFFFFFFFFFFFFFFFFINISH THISSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

(remember to include connection pool)

## 3.3 Querying with ClearDB and MySQL

Most of the database used in this program was made by my awesome coworker, Linda Yang. She used a MySQL workbench type application, established a remote connection to the database, and created the tables from there. Unfortunately, due to our poor status as interns, we don't actually have access to these SQL tools (As far as I know, at least). Also, as far as I know, there's no way to query to the ClearDB from the IBM Cloud or from ClearDB's interface itself, so we're going to have to be a bit more clever.

It seems like the **only way we can query this database, is through our application and node.js server**, so what I did, is **make a webpage whose sole function is to make any query to any part of the database**. The application itself is routed from ('/make-query'), and the page contains only a text area to put your query in, a button to submit it, and a section that displays the query result.

The application logic is very simple. The submit button makes a POST request with the inputted text, and I simply use my newQuery function (which just makes a query) with whatever input it received, and displays the result in that section.

Whenever I needed to create a new table, add/remove/edit a column, delete rows, or do anything relating to the database, I would go to that webpage and make the query from there.

Not the most elegant solution, but one that worked for me nonetheless.

To make things easier for myself, I added a few more functions to my application, accessible through the URL, including a function that displays all the data in the table ('/test'), a function that deletes all rows from the user table ('/delete-all-data-from-table-user'), and one that deletes all from the funding table ('/delete-all-data-from-table-funding').

## 3.4 User Authentication using Passport
For user authentication with Passport, a Node library, I largely based my code on [this tutorial](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)

However, there are a few important differences between my code and the code from the tutorial. First of all, the tutorial uses MongoDB and Mongoose as their databases. Here in the Ontario Ministry of Health, nobody uses NoSQL databases, we use MS SQL Server, Oracle (SQL), and other relational databases. So, as mentioned before, I used the ClearDB MySQL database instead.

So each time in the tutorial, when they would use any sort of mongoose database-related code like:

```javascript
// find a user whose email is the same as the forms email
// we are checking to see if the user trying to login already exists
User.findOne({ 'local.email' :  email }, function(err, user) {
 ...
});
```

I would replace it with ...

```javascript
// Use a query to find a user whose email is the same as the forms email
query.newQuery("SELECT Email FROM user u WHERE u.Email LIKE '" + email + "';", function(error, user) {
	...
});
```

Note, I later changed it again to what it is now ...

```javascript
// Use a query to find a user whose email is the same as the forms email
query.newQuery("SELECT UserName FROM user u WHERE u.UserName LIKE '" + userName + "';", function(error, data) {
	...
});
```


Another important difference, is that I used two-factor authentication in my version, but that is a feature I added much later, and I will get to explaining that portion later as well.

## 3.5 Sending emails and tokens

NOT DONE!!! D:

## 3.6 Things I'm too dumb to figure out

The main thing I have yet to implement successfully is a way to **get rid of unvalidated users** and their **expired tokens**. If you look in the file 'loginquery.js', you'll find a pair of purge functions. Neither of these really function properly. If you are continuing to work on this project, and can solve the token problem, then that would be **awesome**.


# 4.0 Conclusion
*The Die is Cast. The Rubicon has been crossed. Mother, you will either see me the next Pontifex Maximus, or go into exile.* From here until 4-8 months from now, there's no going back.  But I believe in you, young co-op student. You will veni, vidi, and then vici every challenge you face at this workplace, and emerge as undisputed master of Rome, and by extension, the World.

Hopefully this document will ~~secure my legacy~~ help you with your job here.

If you have any questions at all about your job here, the program I made, or even if you just want to have a nice chat, you can certainly contact me. In most jobs, you're supposed to work with a team and have a mentor, but if you're like me and working solo on a cloud project, you won't be getting that luxury. If need be, I can be your mentor... for a price. And that price is apparently nothing. So yeah just contact me I guess.

My email is 'haoda.fan@outlook.com'. You can also find me through github: (https://github.com/haodafan), or linkedin (http://linkedin.com/in/haodafan), or you can just text me I guess (226 979 9881). Also please visit my website!!! http://haodafan.com

Thank you! GL HF!
