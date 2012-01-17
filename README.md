* Add jPlayer (http://www.jplayer.org/latest/developer-guide/)
* "Database" will be a set of zip files you email me with:

    volume-1 (folder)
        volume-1.json (text file)
        fatalflowergarden.mp3
        thebutchersboy.mp3
        fatalflowergarden.jpg
        thebutchersboy.jpg
        fatalflowergarden.html
        thebutchersboy.html

So the zip file has a special text file named ".json", a bunch of mp3s, a bunch of images, and a bunch of "html" files that are just partial html, don't worry about all the head and body tags, just write what you want and it would be plopped into a page.

Example: fatalflowergarden.html

    <img src="fatalflowergarden.jpg" />
    <p><strong>Virgin of the Birds<strong> brings us a great rendition of <em>Fatal Flower Garden</em>.</p>
    <p>This classic song...</p>

The json file is less flexible... and has most of the information about the volume.

Example volume-1.json

    {
      volume_title: "Volume 26",
      volume_subtitle: "A Tribute to the Anthology of American Folk Music",
      tracks: [
        "Virgin of the Birds - Fatal Flower Garden",
        "fatalflowergarden.mp3",
        "fatalflowergarden.html",

        "Caitlin Sherman & Emily Pothast - The Butcher’s Boy",
        "thebutchersboy.mp3",
        "thebutchersboy.html",

        "Football Knowledge - King Kong Kitchie Kitchie Ki-Me-O",
        "kingkongkitchie.mp3",
        "kingkongkitchie.html",

        "Steven Kattenbraker - Ommie Wise",
        "ommiewise.mp3",
        "ommiewise.html",

        "Nate Biehl & Caroline Keys - My Name Is John Johanna",
        "mynameisjohn.mp3",
        "mynameisjohn.html",

        "Norman Baker - John Hardy Was a Desperate Little Man",
        "johnhardy.mp3",
        "johnhardy.html",

        "Rory Gannon - Gonna Die with a Hammer in My Hand",
        "roygannon.mp3",
        "roygannon.html",

        "Ben Fisher - Frankie",
        "frankie.mp3",
        "frankie.html",

        "The Way It Is - Engine 143",
        "engine143.mp3",
        "engine143.html",

        "Amateur Radio Operator - Oh Death Where Is Thy Sting",
        "ohdeathwhere.mp3",
        "ohdeathwhere.html",

        "Mary-Anne McTrowe - Present Joys",
        "presentjoys.mp3",
        "presentjoys.html",

        "Levi Fuller - John the Revelator",
        "johntherevelator.mp3",
        "johntherevelator.html",

        "Jeremy Burk - Shine on Me",
        "shineonme.mp3",
        "shineonme.html",

        "Chicken Tractor Deluxe - Minglewood Blues",
        "minglewoodblues.mp3",
        "minglewoodblues.html",

        "Pufferfish - I Wish I Was a Mole in the Ground",
        "iwishiwasamole.mp3",
        "iwishiwasamole.html",

        "Sokai Stilhed - See That My Grave Is Kept Clean",
        "seethatmygrave.mp3",
        "seethatmygrave.html",

        "Cait Olds - Spike Driver Blues",
        "spikedriverblues.mp3",
        "spikedriverblues.html",

        "Colin J. Nelson - Dog and Gun",
        "dogandgun.mp3",
        "dogandgun.html",

        "The Wringers - West Virginia Gals"",
        "westvirginagals.mp3"
        "westvirginagals.html"
      ]
    }

* App / Web App
  * Mozilla and Chrome app stores
  * "Install as an App" dialog
  * Not doing iTunes due to obscene 30% tax