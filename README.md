# Next JS & Open AI / GPT: Next-generation Next JS & AI apps

This is the starter repo for the [Next JS & Open AI / GPT: Next-generation Next JS & AI apps course](https://www.udemy.com/course/next-js-ai/?referralCode=CF9492ACD4991930F84E).

//PROTECTING ROUTES

//we need to use next js server side props with auth0 to protect our routes. For a route that needs protecting we can add.

export const getServerSideProps = withPageAuthRequired(() => {
return {
props: {
test: 'this is a test'
}
};
});
