describe("VERSIONS", function () {


it("INPUT TODAYS DATE", function () {

     cy.writeFile('cypress/integration/TEST/versions.txt', '\n\n------------------------------------',{flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.txt', '\ndate: ',{flag: 'a+'})

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.date')
        .then(date => {
            cy.writeFile('cypress/integration/TEST/versions.txt', date ,{flag: 'a+'})
            
            
        })
        cy.writeFile('cypress/integration/TEST/versions.txt', " - " ,{flag: 'a+'})

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.dayOfWeek')
        .then(dayOfWeek => {
            cy.writeFile('cypress/integration/TEST/versions.txt', dayOfWeek ,{flag: 'a+'})
            
            
        })

    }) 


    it("REU dev", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nREUNIONES:', {flag: 'a+'})

        
        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nDEV: ', {flag: 'a+'})
        
       
        cy.visit('https://app.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  

    })

     it("REU pre", function () {

     

        cy.writeFile('cypress/integration/TEST/versions.txt', '\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://app.pre.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div[2]/div/div[4]/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  

    }) 

    it("REU CORE staging", function () {

       

        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE staging: ', {flag: 'a+'})
        cy.request('GET', "https://api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

    })



       

        it("REU", function () {

   
        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://app.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      

})

        it("REU CORE production", function () {

       

        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE production: ', {flag: 'a+'})
        cy.request('GET', "https://api.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

    })

        


    it("OVAC dev", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nOVAC:', {flag: 'a+'})


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nDEV: ', {flag: 'a+'})
        
       
        cy.visit('https://ovac.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      

})




    

    it("OVAC pre", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://ovac.pre.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div[2]/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      

})

    it("OVAC CORE staging", function () {


 



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE staging: ', {flag: 'a+'})
        cy.request('GET', "http://api.ovac.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
  }) 

    it("OVAC", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://ovac.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div[2]/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      

})


    it("OVAC CORE production", function () {


 



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE production: ', {flag: 'a+'})
        cy.request('GET', "https://api.ovac.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
  })



    it("EVID dev", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nEVID:', {flag: 'a+'})


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nDEV: ', {flag: 'a+'})
        
       
        cy.visit('https://evid.dev.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    it("EVID pre", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://evid.pre.councilbox.com/')
        cy.get('#client-version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    it("EVID CORE staging", function () {

    



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE staging: ', {flag: 'a+'})
        cy.request('GET', "http://evid-api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
 })


    it("EVID", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://evid.pre.councilbox.com/')
        cy.xpath('//*[@id="root"]/div[1]/div[2]/div/div[1]/div/div[2]/div/div[3]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })


    it("EVID CORE production", function () {

    



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nCORE production: ', {flag: 'a+'})
        cy.request('GET', "https://evid-api.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
 })


it("PORTAL dev", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nPORTAL:', {flag: 'a+'})


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nDEV: ', {flag: 'a+'})
        
       
        cy.visit('https://portal.dev.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    it("PORTAL pre", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://portal.dev.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    it("PORTAL", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://portal.councilbox.com/')
        cy.xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span/text()').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })






    it("SHUTTER pre", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nSHUTTER:', {flag: 'a+'})
        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://app.shutter.pre.councilbox.com/')
        cy.get('#version').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    

    it("SHUTTER", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://app.shutter.councilbox.com/')
        cy.xpath('//*[@id="shutter-app"]/div/div[2]/h6/text()[4]').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })






    it("HORUS pre", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nHORUS:', {flag: 'a+'})
        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nSTAGING: ', {flag: 'a+'})
        
       
        cy.visit('https://horus.pre.councilbox.com/admin')
        cy.xpath('//*[@id="root"]/div/div/div/div/div[4]/small/text()[2]').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })

    

    it("HORUS", function () {


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nPRODUCTION: ', {flag: 'a+'})
        
       
        cy.visit('https://horus.councilbox.com/admin')
        cy.xpath('//*[@id="root"]/div/div/div/div/div[4]/small/text()[2]').then(($temp)=>{
        const txt = $temp.text()
        cy.writeFile('cypress/integration/TEST/versions.txt', txt, {flag: 'a+'})


        })  
      })




})
    

    
