import puppeteer from 'puppeteer';
import fs from 'fs'; 


const mainUrl='https://www.medicineindia.org/medical-colleges';

async function getcollegelinks(page) 
{
   
   try{
   
        
        console.log('Navigating to the main page...');
        await page.goto(mainUrl);
        
        console.log('Fetching links...');
        // Find all the links to individual medical college details pages
        const collegeLinks = await page.$$eval('a[href]', (links) =>links.filter(link => link.textContent.includes('Medical College')).map(link => link.href)
        );
        
        console.log(`Found ${collegeLinks.length} medical college links.`);
        return collegeLinks;
        

    }
/*     try{
        await page.goto(mainUrl,{waituntil:'networkidle0'});
        const collegeLinks=await page.$$eval('a[href]',(links)=>links.map(link => link.href)
        .filter(href => href.includes('medical-colleges-details'))
);
console.log(`Found ${collegeLinks.length} medical college links.`);
return collegeLinks; */

    catch(error)
    {
        console.error(`Error fetching links: ${error}`);
        return [];

    }
}
/* async function scrapeCollegeData(page, url) {
    try {
        console.log(`Navigating to ${url}...`);
        await page.goto(url);

        console.log('Extracting data...');
        // Extract the college name (assuming it is in <h1>)
        const collegeName = await page.$eval('h1', el => el.textContent.trim());

        // Extract other relevant details
         const addressDetails = await page.$$eval('dd', (details) => details.map(detail => detail.textContent.trim()));



        // Extract phone numbers (assuming it follows the address details structure)
        const phoneNumbers = addressDetails.filter(detail => detail.startsWith('Phone')).map((_, index) => addressDetails[index + 1]);
        const Emails = addressDetails.filter(detail => detail.startsWith('EMail')).map((_, index) => addressDetails[index + 1]);
        const Website = addressDetails.filter(detail => detail.startsWith('Website')).map((_, index) => addressDetails[index + 1]);

        // Build the college data object */
       /*  const collegeData = {
            collegeName,
            UniversityName:addressDetails[1],
            ManagmentType: addressDetails[2],
            FoundingYear:addressDetails[3],
            address: addressDetails[4],
            state: addressDetails[5],
            Country: addressDetails[6],
            ContactDetails: phoneNumbers,
            Emails,
            Website
        };

        return collegeData;
    } catch (error) {
        console.error(`Error scraping data from ${url}: ${error}`);
        return {};
    }
} */ 
/* async function scrapeCollegeData(page, url) {
        try {
            console.log(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle0' });
    
            console.log('Extracting data...');
            // Extract the college name (assuming it is in <h1>)
            const collegeName = await page.$eval('h1', el => el.textContent.trim());
    
            // Extract other relevant details
            const addressDetails = await page.$$eval('dd', (details) =>
                details.map(detail => detail.textContent.trim())
            );
    
            // Extract phone numbers, emails, and website (adjust according to actual content)
/*             const ContactInfo = addressDetails.filter(detail => detail).map((_, index) => addressDetails[index + 1] || '').filter(Boolean);
 */           /*  const Emails = addressDetails.filter(detail => detail).map((_, index) => addressDetails[index + 1] || '').filter(Boolean);
            const Website = addressDetails.filter(detail => detail).map((_, index) => addressDetails[index + 1] || '').filter(Boolean);
     */
            // Build the college data object
           /*  const ContactInfo = addressDetails.filter(detail => detail.startsWith('Phone')).map((_, index) => addressDetails[index + 1]);

            const collegeData = {
                collegeName,
                UniversityName: addressDetails[1] || '',
                ManagmentType: addressDetails[2] || '',
                FoundingYear: addressDetails[3] || '',
                address: addressDetails[4] || '',
                state: addressDetails[5] || '',
                Country: addressDetails[6] || '',
                ContactDetails: ContactInfo
              /*   ContactDetails: Emails,
                ContactDetails:Website, */
           /*  };
    
            return collegeData;
        }
        catch (error) {
            console.error(`Error scraping data from ${url}: ${error}`);
            return {};
        }
} */ 

        async function scrapeCollegeData(page, url) {
            try {
                console.log(`Navigating to ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle0' });
        
                console.log('Extracting data...');
                // Extract the college name (assuming it is in <h1>)
                const collegeName = await page.$eval('h1', el => el.textContent.trim());
        
                // Extract contact details
                const contactDetails = await page.$$eval('dd', (details) =>
                    details.map(detail => detail.textContent.trim())
                );
        
                // Initialize empty arrays for phone numbers, emails, and websites
                let phoneNumbers = [];
                let emails = [];
                let websites = [];
                let universityName = '';
                let managementType = '';
                let foundingYear = '';
                let address = '';
                let state = '';
                let country = '';
        
                // Define regex patterns for phone numbers, emails, and websites
                const phoneRegex = /(\d{3,5}[-\s]?\d{3,5}[-\s]?\d{3,5})/g; 
                const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/; 
                const websiteRegex = /\b(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,6}(\/[\w-]*)*/gi;
        
                // Iterate through contact details and extract information
                contactDetails.forEach((detail, index) => {
                    // Match phone numbers using the regex pattern
                    const phones = detail.match(phoneRegex);
                    if (phones) {
                        phoneNumbers.push(...phones.map(phone => phone.trim()));
                    }
        
                    // Match email addresses
                    const email = detail.match(emailRegex);
                    if (email) {
                        emails.push(email[0].trim());
                    }
        
                    // Match websites
                    const website = detail.match(websiteRegex);
                    if (website) {
                        websites.push(website[0].trim());
                    }
        
                    // Assign other details by index (assuming this structure from the website)
                    if (index === 1) {
                        universityName = detail;
                    } else if (index === 2) {
                        managementType = detail;
                    } else if (index === 3) {
                        foundingYear = detail;
                    } else if (index === 4) {
                        address = detail;
                    } else if (index === 5) {
                        state = detail;
                    } else if (index === 6) {
                        country = detail;
                    }
                });
        
                // Build the college data object
                const collegeData = {
                    collegeName,
                    UniversityName: universityName,
                    ManagementType: managementType,
                    FoundingYear: foundingYear,
                    Address: address,
                    State: state,
                    Country: country,
                    ContactDetails: phoneNumbers,
                    Emails: emails,
                    Websites: websites
                };
        
                return collegeData;
            } catch (error) {
                console.error(`Error scraping data from ${url}: ${error}`);
                return {};
            }
        }
        
        

// Function to save the college data either to a JSON file
function saveCollegeData(collegeData, fileName = 'medical_colleges.json') {
    try {
        const data = JSON.stringify(collegeData, null, 2);
        fs.appendFileSync(fileName, data + '\n');
        console.log(`Data from ${collegeData.collegeName} saved.`);
    } catch (error) {
        console.error(`Error saving data: ${error}`);
    }
}
async function crawlMedicalColleges() {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        console.log('Getting college links...');
        const collegeLinks = await  getcollegelinks(page);

        if (collegeLinks.length === 0) {
            console.log('No college links found.');
            await browser.close();
            return;
        }

        // Scrape data from each medical college link
        for (const url of collegeLinks) {
            const collegeData = await scrapeCollegeData(page, url);
            if (collegeData && collegeData.collegeName) {
                saveCollegeData(collegeData);
            }
        }

        // Close the browser after scraping
        await browser.close();
        console.log('Scraping completed.');
    } catch (error) {
        console.error(`Error in crawling process: ${error}`);
    }
}

// Call the crawl function to start scraping and saving data
crawlMedicalColleges();