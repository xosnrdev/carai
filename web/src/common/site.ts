export type SiteConfig = typeof siteConfig;

const siteConfig = {
    name: "Carai",
    title: "Carai - Write, Test, and Share Code Online",
    author: "Success Kingsley <hello@xosnrdev.com>",
    description:
        "An online platform to easily write, test, and share code with others. Carai is your all-in-one open-source platform for coding, testing, and collaboration.",
    repo: "https://github.com/xosnrdev/carai",
    siteUrl:
        process.env.NODE_ENV === "production" ? "https://codespacex.com" : "http://localhost:3000",
};

export default siteConfig;
