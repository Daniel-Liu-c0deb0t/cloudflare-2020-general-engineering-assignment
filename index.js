// some constants that will be displayed in the website
const links = [
    { "name": "website", "url": "http://liudaniel.com/" },
    { "name": "blog", "url": "https://blog.liudaniel.com/" },
    { "name": "github", "url": "https://github.com/Daniel-Liu-c0deb0t" }
]
const staticUrl = "https://static-links-page.signalnerve.workers.dev"
const profileImgUrl = "https://avatars3.githubusercontent.com/u/6693560?s=460&u=da1e7283e64c7dfd10cc6045f43bed7c22458100&v=4"
const profileName = "Daniel Liu"
const color = "bg-red-400"
const socials = [
    { "icon": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg", "url": "https://twitter.com/daniel_c0deb0t" },
    { "icon": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg", "url": "https://www.linkedin.com/in/daniel-liu-c0deb0t" }
]

// a bunch of transformers for satifying all of the required and extra-credit tasks

class LinkTransformer {
    constructor(links) {
        this.links = links
    }

    async element(element) {
        for (const link of this.links) {
            const name = link["name"]
            const url = link["url"]
            element.append(`<a href = "${url}">${name}</a>\n`, { html: true })
        }
    }
}

class DisplayTransformer {
    async element(element) {
        element.setAttribute("style", "")
    }
}

class ProfileImgTransformer {
    constructor(profileImgUrl) {
        this.profileImgUrl = profileImgUrl
    }

    async element(element) {
        element.setAttribute("src", this.profileImgUrl)
    }
}

class ProfileNameTransformer {
    constructor(profileName) {
        this.profileName = profileName
    }

    async element(element) {
        element.setInnerContent(this.profileName)
    }
}

class ColorTransformer {
    constructor(color) {
        this.color = color
    }

    async element(element) {
        element.setAttribute("class", this.color)
    }
}

class SocialTransformer {
    constructor(socials) {
        this.socials = socials
    }

    async element(element) {
        element.setAttribute("style", "")

        for (const social of this.socials) {
            // fetch icons from Simple Icons CDN
            const icon = await (await fetch(social["icon"])).text()
            const url = social["url"]
            element.append(`<a href = "${url}">${icon}</a>\n`, { html: true })
        }
    }
}

async function handleRequest(req) {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === "/links") {
        // the links endpoint should return a JSON object with the links
        return new Response(JSON.stringify(links), {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    } else {
        // otherwise, display the site contents
        const init = {
            headers: {
                "content-type": "text/html;charset=UTF-8"
            }
        }
        // get the exiting static page, so we can edit it
        const response = await fetch(staticUrl, init)
        const res = new HTMLRewriter()
            .on("div#links", new LinkTransformer(links))
            .on("div#profile", new DisplayTransformer())
            .on("img#avatar", new ProfileImgTransformer(profileImgUrl))
            .on("h1#name", new ProfileNameTransformer(profileName))
            .on("title", new ProfileNameTransformer(profileName))
            .on("body", new ColorTransformer(color))
            .on("div#social", new SocialTransformer(socials))
            .transform(response)
        return res
    }
}

addEventListener("fetch", event => {
    return event.respondWith(handleRequest(event.request))
})
