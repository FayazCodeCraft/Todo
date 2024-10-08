import type {Config} from "drizzle-kit"

export default {
    schema:"dist/db/schemas/*",
    out:"./drizzle",
    driver:"better-sqlite",
    dbCredentials:{
        url:"./sqlite.db"
    },
}  satisfies Config