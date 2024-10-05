
function LogIn() {
    return (
       
           
                <form>
                    
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control rounded-3" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control rounded-3" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="w-100 my-2 btn btn-lg btn-primary" type="button">Log in</button>
                    
               
                    
                       
                    {/*
                        <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" for="flexCheckDefault">
                            Remember me
                        </label>
                        </div>
                        
                    */}    
                 
                </form>
      
          
    
    );
};

export default LogIn;