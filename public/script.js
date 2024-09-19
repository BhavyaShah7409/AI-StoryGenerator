
async function generateStory() {
    const genre = document.getElementById('genre').value;
    const words = document.getElementById('words').value;

    const requestBody = {
        genre: genre,
        words: words
    };

    try {
        const response = await fetch('http://localhost:3000/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('storyText').innerText = data.story;
            document.getElementById('storyOutput').style.display = 'block';
        } else {
            console.error('Error:', response.statusText);
            alert('There was an error generating the story. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error generating the story. Please try again.');
    }
}
