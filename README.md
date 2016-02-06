# meshdiff

Inspired by <code> git diff </code> this command line tool helps you visually diff changes in your 3D meshes.

<code> meshdiff mesh1.stl mesh2.stl </code>

![Image of diff](https://github.com/TimothyStiles/meshdiff/blob/master/diffImage.png)


# install

<code> npm install meshdiff -g </code>




# build from repo

<code> git clone https://TimothyStiles@github.com/TimothyStiles/meshdiff.git && cd meshdiff && npm run build </code>


# usage

Currently meshdiff only supports files with the .stl extension. To produce a diff between a newer and older version of your mesh run the following after install:

<code> meshdiff filePathTonNewerMesh.stl filePathToOlderMesh.stl </code>

Meshdiff will then open your default browser (only chrome and firefox currently supported) load and render your original meshes. Then meshdiff will produce a visual diff by transforming your meshes into constructive solid geometries which it will use to find the following:


<code> newerMesh - olderMesh // render green for new addition to mesh </code>

<code> oldermesh - newerMesh // render red for new subtraction to mesh </code>

<code> newerMesh ∩ oldermesh // render blue for no change in mesh </code>

<code> (olderMesh - (olderMesh - newerMesh)) - (newerMesh ∩ oldermesh) // render red for new subtraction to mesh </code>

The resulting solid geometries will then be transformed back into meshes and rendered to the appropriate colors using a Lambert shading material in your browser thus producing your meshdiff!



#todo
Port browser selection to electron instead of relying on users native browser.

Add support for PLY, OBJ, etc files.

Figure out computationally efficient way to display holes made in old mesh from new mesh. Can be done using:

<code> (olderMesh - (olderMesh - newerMesh)) - (newerMesh ∩ oldermesh) </code> 

but is tricky to implement because of time/ language constraints.

Possibly port to clojure/clojurescript for multithreading and immutable data structures.

Fix registration.



# license
Copyright 2016 Timothy S. Stiles

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
