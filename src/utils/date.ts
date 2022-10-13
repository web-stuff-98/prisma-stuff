export default ((str:string) => {
     const date = new Date(str)  
     return `${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()}`
})