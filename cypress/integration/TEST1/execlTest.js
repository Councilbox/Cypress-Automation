describe("VERSIONS", function () {




it("INPUT TODAYS DATE", function () {




        cy.writeFile('cypress/integration/TEST/versions.csv', '\n',{flag: 'a+'})

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.date')
        .then(date => {
            cy.writeFile('cypress/integration/TEST/versions.csv', date ,{flag: 'a+'})
            
            
        })
        

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.dayOfWeek')
        .then(dayOfWeek => {
            cy.writeFile('cypress/integration/TEST/versions.csv', ' ' ,{flag: 'a+'})
            cy.writeFile('cypress/integration/TEST/versions.csv', dayOfWeek ,{flag: 'a+'})


        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

    }) 


    it("REU dev", function () {


        
       
        cy.visit('https://app.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  

    })

     it("REU pre", function () {

     

        
       
        cy.visit('https://app.pre.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  

    }) 



    it("REU CORE staging", function () {

       

       
        cy.request('GET', "https://api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

    })



       

        it("REU", function () {

   
        
       
        cy.visit('https://app.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      

})

        it("REU CORE production", function () {

       


        cy.request('GET', "https://api.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

    })

        


    it("OVAC dev", function () {

 



        
       
        cy.visit('https://ovac.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      

})




    

    it("OVAC pre", function () {


      
        
       
        cy.visit('https://ovac.pre.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div[2]/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      

})

    it("OVAC CORE staging", function () {


 



        
        cy.request('GET', "http://api.ovac.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

        
  }) 

    it("OVAC", function () {


        
       
        cy.visit('https://ovac.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div[2]/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      

})


    it("OVAC CORE production", function () {


 



        
        cy.request('GET', "https://api.ovac.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

        
  })



    it("EVID dev", function () {

   
        
       
        cy.visit('https://evid.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    it("EVID pre", function () {


   
        
       
        cy.visit('https://evid.pre.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    it("EVID CORE staging", function () {

    



       
        cy.request('GET', "http://evid-api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

        
 })


    it("EVID", function () {


  
       
        cy.visit('https://evid.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })


    it("EVID CORE production", function () {

    



        cy.request('GET', "https://evid-api.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.csv', version, {flag: 'a+'})

            cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})
            
            
        })

        
 })


it("PORTAL dev", function () {

  
        
       
        cy.visit('https://portal.dev.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    it("PORTAL pre", function () {


        
       
        cy.visit('https://portal.pre.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    it("PORTAL", function () {


     
        
       
        cy.visit('https://portal.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })






    it("SHUTTER pre", function () {

 
        
       
        cy.visit('https://app.shutter.pre.councilbox.com/')
        cy.get('#version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    

    it("SHUTTER", function () {


     
        
       
        cy.visit('https://app.shutter.councilbox.com/')
        cy.get('#version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })






    it("HORUS pre", function () {


        
       
        cy.visit('https://horus.pre.councilbox.com/admin')
        cy.xpath('//*[@id="root"]/div/div/div/div/div[4]/small/text()[2]').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.csv', "," ,{flag: 'a+'})


        })  
      })

    

    it("HORUS", function () {



        
       
        cy.visit('https://horus.councilbox.com/admin')
        cy.xpath('//*[@id="root"]/div/div/div/div/div[4]/small/text()[2]').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.csv', txt, {flag: 'a+'})

        

        })  
      })




})
    

    
