# mdiff

## A command line tool to visually diff 3D meshes.

# example

``` shell

mdiff mesh1.obj mesh2.obj

```

# build

## Mac OSX

To install mdiff you will need to have node and git installed.



### If you do not have node and git installed. I suggest that you install them through the Mac OSX package manager [homebrew](http://brew.sh/);

``` shell

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

```

``` shell

brew install git && brew install node

```

### If you already have git and node installed just run this from the command line.

``` shell

git clone https://TimothyStiles@bitbucket.org/TimothyStiles/mdiff.git && cd mdiff && npm run build 

```

and then mdiff your objects!

``` shell

mdiff mesh1.obj mesh2.obj

```



