# Title: SO YOU WANT TO BE A SOFTWARE DEVELOPER ON THE IBM CLOUD AS A COOP INTERN WORKING FOR THE MINISTRY OF HEALTH AND LONG TERM CARE!
Wow, that is a mouthful.
**By: Haoda Fan**

# 1.0 INTRODUCTION
Welcome to the machine. You are a small cog in the infinitely large and infinitely inefficient engine that is the Ontario Government. To survive, you cannot simply follow the mindless herd. You must rise above the herd, define your own identity, and become your own individual. Become the Ubermensch.

Anyways, on to cloud development.

# 2.0 PROBLEMS YOU WILL ENCOUNTER AND HOW TO SOLVE ... MOST OF THEM

## 2.1 Administrative Privileges
**Problem**

As a software development intern, you do not have access to administrative priviledges on your computer! This means you will not be able to INSTALL any programs onto your computer, or CHANGE any sensitive data or settings on your computer. Of course, you can still download files from the internet, but when you have to install a new language, or change a PATH variable, then you will not have permission to do so.

**Solution**

To solve this problem, you will need to enlist the help of your manager. If the heavens smile upon you this co-op term, then the ministry might be able to get you administrative priviledges to your own computer upon your request; however, that is unlikely to happen, and it did not happen to me. More likely, after a lengthy request process, your manager will most likely have to give admin access to your computer to a trusted coworker.

After he/she gains access to your computer, every time you need administrative priviledges, you will have to ask him/her to login and install or change things for you.

## 2.2 The OPS Firewall

The OPS firewall is probably the single most annoying obstacle you will encounter in your first few days or weeks (or if you're me, months) of work. The Ontario Public Service's Great Firewall restricts you to such an extent, that it makes even Fang BinXing jealous ^[citation needed]. The OPS firewall forbids you from accessing certain websites (such as YouTube), and denies you the freedom to download and access the web from the command line or through third party applications that aren't browsers (such as Maven).

Luckily, us Cloud Developers are a bit more clever than the average government grunt. Throughout my ~~reign~~ time here, I have been able to figure out how to bypass this firewall through the clever use of a **proxy**.

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

To accomplish this is very simple. You'll simply need to run JMeter through the **command line** with certain settings. Here is a step-by-step process...

1. Navigate to the folder where JMeter is located.
2. Shift + Right Click on the 'bin' folder
3. Click 'Open command window here'. It should open up command prompt at that location.
4. Enter the following command:
```
jmeter.bat -H 204.40.130.129 -P 3128 -N localhost,127.0.0.1 -u -a
```

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

Now, you should be able to run the Bluemix CLI without any dehabilitating firewall issues (there is one little issue, which I will get to later).

### 2.2.4 Setting up a proxy for Node and NPM

If you want to get in on the newest ~~fads~~ ~~trends~~ ~~bandwagons~~ technologies in the web development world, you'll need to use Node.JS, and its equally important partner, Node Package Manager (npm). Unfortunately, it uses a command line interface, and like everything else with command lines, the firewall hates it with a passion. Once again, let's set a proxy. Open up the command line, and type the following two commands:
`npm config set proxy http://204.40.130.129:3128`
`npm config set https-proxy https://204.40.130.129:3128`

With these set up, you should be able to run npm commands liberally.

### 2.2.5 Setting up a proxy for Git

In order to use the git command line interface (very useful if you use github or any kind of git-related version control system), you'll need to set a proxy in a very similar fashion to the proxy set for node and npm. Simply enter the following commands:

`git config --global http.proxy http://204.40.130.129:3128`
`got config --global https.proxy https://204.40.130.129:3128`

Now clone and push and pull and merge at will! You're free I say! Free!

## 2.3 Node Package Manager
**Problem**
If you use Node.js, or any advanced Javascript framework, then you will definitely want to use Node Package Manager, or npm. After installing node and setting up a proxy for npm (Refer to section 2.2.4), most npm packages can be installed without problem using the command line. Most. Unfortunately, there are some that won't work, namingly '--global' installations, and some packages required to run angular and react.

I figured the problem must lie with my (lack of) administrative privildeges, so I asked my coworker to run the command line as admin, so that I could install them with the correct priviledges. Unfortunately, that didn't work, because (and this is just speculation, I'm still not sure exactly why it didn't work) logging into his administrative account must have mixed up the command line's installation addresses.  

**Solution for non global packages**
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

**Solution for global packages**
Similarily and also unfortunately, I also could not find a way to make this work directly on the work computers as well. The only way I knew to get around this, is that whenever you want to use a global command, to transfer the necessary files to your home computer, install/use the global command from home, and then transfer it back to the work computers. This is highly inefficient, so I either avoid global commands whenever possible, or I bring my home computer (which happens to be a laptop) to work, and use my computer with the wifi downstairs when I needed to. Not exactly an elegant solution, but it worked for me.

**__If you come up with a better solution, then by all means, go ahead and use that. This is just what I have learned worked best for me at the time (with the information I possessed).__**

## 2.4 UNSOLVED ISSUES

### 2.4.1 'Proxy Authentication Required'

Even after setting a proxy, every so often, you are once again prevented from accessing the internet via command line because of an error that prompts you to authenticate yourself ("Proxy Authentication Required."). To this day, I still have no idea what causes it. I do know that it usually happens early in the morning (~9AM), at noon, and about an hour or so before I'm supposed to leave (~4pm).

The problem usually goes away after simply waiting 5-10 minutes, although sometimes, this 'authentication required' block can last up to an hour. It's really not good for productivity, but I honestly have no clue what causes it and how to fix it, so I normally just wait it out.
