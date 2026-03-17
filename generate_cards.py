
import json
import os

verses = [
    {"ref": "Psalm 31:24", "text": "Be strong and take heart, all you who hope in the Lord.", "topic": "Encouragement and Hope"},
    {"ref": "Isaiah 40:31", "text": "But those who hope in the Lord will renew their strength.", "topic": "Encouragement and Hope"},
    {"ref": "John 16:33", "text": "In this world you will have trouble. But take heart! I have overcome the world.", "topic": "Encouragement and Hope"},
    {"ref": "Philippians 4:13", "text": "I can do all this through him who gives me strength.", "topic": "Encouragement and Hope"},
    {"ref": "Jeremiah 29:11", "text": "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", "topic": "Encouragement and Hope"},
    {"ref": "Isaiah 41:10", "text": "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.", "topic": "Encouragement and Hope"},
    {"ref": "Psalm 28:7", "text": "The Lord is my strength and my shield; in him my heart trusts, and I am helped.", "topic": "Encouragement and Hope"},
    {"ref": "Psalm 46:1", "text": "God is our refuge and strength, an ever-present help in trouble.", "topic": "Encouragement and Hope"},
    {"ref": "Hebrews 13:5", "text": "He will never leave you nor forsake you.", "topic": "Encouragement and Hope"},
    {"ref": "Lamentations 3:22-23", "text": "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", "topic": "Encouragement and Hope"},
    {"ref": "Psalm 118:24", "text": "This is the day the Lord has made; we will rejoice and be glad in it.", "topic": "Encouragement and Hope"},
    {"ref": "Philippians 4:6-7", "text": "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", "topic": "Encouragement and Hope"},
    {"ref": "Matthew 11:28", "text": "Come to Me, all who labor and are heavy laden, and I will give you rest.", "topic": "Encouragement and Hope"},
    {"ref": "1 Peter 5:7", "text": "Casting all your anxieties on him, because he cares for you.", "topic": "Encouragement and Hope"},
    {"ref": "Psalm 46:10", "text": "Be still, and know that I am God.", "topic": "Encouragement and Hope"},
    {"ref": "Romans 15:13", "text": "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", "topic": "Encouragement and Hope"},
    {"ref": "Nehemiah 8:10", "text": "The joy of the Lord is your strength.", "topic": "Encouragement and Hope"},
    {"ref": "Proverbs 3:6", "text": "In all your ways acknowledge him, and he will make straight your paths.", "topic": "Encouragement and Hope"},
    {"ref": "Psalm 145:9", "text": "The Lord is good to all.", "topic": "Encouragement and Hope"},
    {"ref": "2 Timothy 1:7", "text": "For God gave us a spirit not of fear but of power and love and self-control.", "topic": "Encouragement and Hope"},
    {"ref": "Hebrews 11:1", "text": "Now faith is confidence in what we hope for and assurance about what we do not see.", "topic": "Faith and Trust"},
    {"ref": "Proverbs 3:5", "text": "Trust in the Lord with all your heart and lean not on your own understanding.", "topic": "Faith and Trust"},
    {"ref": "Romans 8:31", "text": "If God is for us, who can be against us?", "topic": "Faith and Trust"},
    {"ref": "Hebrews 11:6", "text": "Without faith it is impossible to please God.", "topic": "Faith and Trust"},
    {"ref": "2 Corinthians 5:7", "text": "For we live by faith, not by sight.", "topic": "Faith and Trust"},
    {"ref": "Psalm 23:1", "text": "The Lord is my shepherd; I shall not want.", "topic": "Faith and Trust"},
    {"ref": "John 20:29", "text": "Blessed are those who have not seen and yet have believed.", "topic": "Faith and Trust"},
    {"ref": "Romans 10:13", "text": "Indeed, 'everyone who calls on the name of the Lord will be saved.'", "topic": "Faith and Trust"},
    {"ref": "Ephesians 2:8", "text": "For by grace you have been saved through faith.", "topic": "Faith and Trust"},
    {"ref": "Luke 1:37", "text": "For nothing will be impossible with God.", "topic": "Faith and Trust"},
    {"ref": "1 John 4:8", "text": "God is love.", "topic": "Love and Relationships"},
    {"ref": "1 Corinthians 16:14", "text": "Do everything in love.", "topic": "Love and Relationships"},
    {"ref": "Mark 12:31", "text": "Love your neighbor as yourself.", "topic": "Love and Relationships"},
    {"ref": "1 John 4:11", "text": "Beloved, if God so loved us, we also ought to love one another.", "topic": "Love and Relationships"},
    {"ref": "1 Peter 4:8", "text": "Above all, love each other deeply, because love covers over a multitude of sins.", "topic": "Love and Relationships"},
    {"ref": "John 13:34", "text": "A new command I give you: Love one another. As I have loved you, so you must love one another.", "topic": "Love and Relationships"},
    {"ref": "Mark 12:30", "text": "Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength.", "topic": "Love and Relationships"},
    {"ref": "Galatians 6:2", "text": "Bear one another's burdens, and so fulfill the law of Christ.", "topic": "Love and Relationships"},
    {"ref": "1 Corinthians 13:13", "text": "And now these three remain: faith, hope and love. But the greatest of these is love.", "topic": "Love and Relationships"},
    {"ref": "1 John 4:19", "text": "We love because he first loved us.", "topic": "Love and Relationships"},
    {"ref": "Proverbs 3:5-6", "text": "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", "topic": "Guidance and Wisdom"},
    {"ref": "Psalm 119:105", "text": "Your word is a lamp for my feet, a light on my path.", "topic": "Guidance and Wisdom"},
    {"ref": "Proverbs 9:10", "text": "The fear of the Lord is the beginning of wisdom.", "topic": "Guidance and Wisdom"},
    {"ref": "Proverbs 19:20", "text": "Hear counsel and receive instruction, that you may be wise in your latter days.", "topic": "Guidance and Wisdom"},
    {"ref": "Romans 12:2", "text": "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", "topic": "Guidance and Wisdom"},
    {"ref": "Matthew 6:33", "text": "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", "topic": "Guidance and Wisdom"},
    {"ref": "Psalm 90:12", "text": "Teach us to number our days, that we may gain a heart of wisdom.", "topic": "Guidance and Wisdom"},
    {"ref": "Ecclesiastes 3:1", "text": "For everything there is a season, and a time for every matter under heaven.", "topic": "Guidance and Wisdom"},
    {"ref": "Proverbs 11:14", "text": "Where there is no guidance, a people falls, but in an abundance of counselors there is safety.", "topic": "Guidance and Wisdom"},
    {"ref": "2 Timothy 3:16", "text": "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", "topic": "Guidance and Wisdom"},
    {"ref": "John 3:16", "text": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", "topic": "Salvation and Grace"},
    {"ref": "Romans 6:23", "text": "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.", "topic": "Salvation and Grace"},
    {"ref": "1 John 1:9", "text": "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", "topic": "Salvation and Grace"},
    {"ref": "Romans 3:23", "text": "For all have sinned and fall short of the glory of God.", "topic": "Salvation and Grace"},
    {"ref": "John 14:6", "text": "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'", "topic": "Salvation and Grace"},
    {"ref": "Ephesians 2:8", "text": "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", "topic": "Salvation and Grace"},
    {"ref": "Romans 10:9", "text": "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.", "topic": "Salvation and Grace"},
    {"ref": "Matthew 4:19", "text": "Come, follow me, Jesus said, and I will send you out to fish for people.", "topic": "Salvation and Grace"},
    {"ref": "Romans 8:1", "text": "There is therefore now no condemnation to those who are in Christ Jesus.", "topic": "Salvation and Grace"},
    {"ref": "John 1:4", "text": "In him was life, and that life was the light of all mankind.", "topic": "Salvation and Grace"},
    {"ref": "Genesis 1:1", "text": "In the beginning God created the heavens and the earth.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Revelation 1:8", "text": "I am the Alpha and the Omega, says the Lord God, who is, and who was, and who is to come, the Almighty.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Psalm 145:17", "text": "The Lord is righteous in all his ways and faithful in all he does.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Numbers 23:19", "text": "God is not human, that he should lie.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Luke 1:37", "text": "For with God nothing will be impossible.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Psalm 97:1", "text": "The Lord reigns, let the earth rejoice.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Psalm 33:9", "text": "For he spoke, and it came to be; he commanded, and it stood firm.", "topic": "God's Nature and Sovereignty"},
    {"ref": "John 10:30", "text": "I and the Father are one.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Zephaniah 3:17", "text": "The Lord your God is in your midst, a mighty one who will save.", "topic": "God's Nature and Sovereignty"},
    {"ref": "Psalm 145:3", "text": "Great is the Lord and greatly to be praised.", "topic": "God's Nature and Sovereignty"},
    {"ref": "1 Thessalonians 5:17", "text": "Pray without ceasing.", "topic": "Prayer and Worship"},
    {"ref": "1 Thessalonians 5:16", "text": "Rejoice always.", "topic": "Prayer and Worship"},
    {"ref": "1 Thessalonians 5:18", "text": "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.", "topic": "Prayer and Worship"},
    {"ref": "Matthew 18:20", "text": "For where two or three gather in my name, there am I with them.", "topic": "Prayer and Worship"},
    {"ref": "Psalm 9:1", "text": "I will give thanks to the Lord with my whole heart.", "topic": "Prayer and Worship"},
    {"ref": "Psalm 150:6", "text": "Let everything that has breath praise the Lord!", "topic": "Prayer and Worship"},
    {"ref": "Psalm 100:1", "text": "Shout for joy to the Lord, all the earth.", "topic": "Prayer and Worship"},
    {"ref": "Colossians 4:2", "text": "Continue steadfastly in prayer, being watchful in it with thanksgiving.", "topic": "Prayer and Worship"},
    {"ref": "Jeremiah 33:3", "text": "Call to me and I will answer you and tell you great and unsearchable things you do not know.", "topic": "Prayer and Worship"},
    {"ref": "Psalm 145:18", "text": "The Lord is near to all who call on him, to all who call on him in truth.", "topic": "Prayer and Worship"},
    {"ref": "1 Peter 1:16", "text": "Be holy, because I am holy.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 Thessalonians 5:19", "text": "Do not quench the Spirit.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 Thessalonians 5:22", "text": "Abstain from every form of evil.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 Thessalonians 5:20-21", "text": "Do not despise prophecies, but test everything.", "topic": "Holiness and Righteous Living"},
    {"ref": "James 4:7", "text": "Submit yourselves, then, to God. Resist the devil, and he will flee from you.", "topic": "Holiness and Righteous Living"},
    {"ref": "Exodus 20:15", "text": "You shall not steal.", "topic": "Holiness and Righteous Living"},
    {"ref": "Exodus 20:13", "text": "You shall not murder.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 John 5:3", "text": "In fact, this is love for God: to keep his commands. And his commands are not burdensome.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 Peter 1:15", "text": "But just as he who called you is holy, so be holy in all you do.", "topic": "Holiness and Righteous Living"},
    {"ref": "1 Peter 1:13", "text": "Therefore, prepare your minds for action, be sober-minded, set your hope fully on the grace that will be brought to you at the revelation of Jesus Christ.", "topic": "Holiness and Righteous Living"},
    {"ref": "2 Corinthians 5:17", "text": "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.", "topic": "Transformation and Growth"},
    {"ref": "Galatians 2:20", "text": "I have been crucified with Christ and I no longer live, but Christ lives in me.", "topic": "Transformation and Growth"},
    {"ref": "Philippians 3:13-14", "text": "Forgetting what is behind and straining toward what is ahead, I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.", "topic": "Transformation and Growth"},
    {"ref": "Philippians 1:6", "text": "He who began a good work in you will carry it on to completion until the day of Christ Jesus.", "topic": "Transformation and Growth"},
    {"ref": "Ephesians 6:10", "text": "Finally, be strong in the Lord and in his mighty power.", "topic": "Transformation and Growth"},
    {"ref": "2 Corinthians 4:17", "text": "For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.", "topic": "Transformation and Growth"},
    {"ref": "Romans 12:21", "text": "Do not be overcome by evil, but overcome evil with good.", "topic": "Transformation and Growth"},
    {"ref": "Hebrews 12:14", "text": "Make every effort to live in peace with everyone and to be holy; without holiness no one will see the Lord.", "topic": "Transformation and Growth"},
    {"ref": "Romans 8:28", "text": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", "topic": "Transformation and Growth"},
    {"ref": "1 Thessalonians 5:11", "text": "Therefore encourage one another and build each other up, just as in fact you are doing.", "topic": "Transformation and Growth"}
]

def get_prompts(verse):
    text = verse["text"].lower()
    topic = verse["topic"]
    
    # Base prompts that are more personal
    prompts = [
        "Tell a personal story about a time you experienced the truth of this verse.",
        f"How does this scripture challenge your current situation or mindset this week?"
    ]
    
    # Specific prompt based on topic or keywords
    if "hope" in text or "encouragement" in topic.lower():
        prompts.insert(1, "What 'storm' in your life right now needs the hope mentioned here?")
    elif "faith" in text or "trust" in topic.lower():
        prompts.insert(1, "What is one specific 'leap of faith' you feel God calling you to take?")
    elif "love" in text or topic.lower() == "love and relationships":
        prompts.insert(1, "Who is the hardest person in your life to show this kind of love to right now?")
    elif "wisdom" in text or "guidance" in topic.lower():
        prompts.insert(1, "Think of a decision you're facing; how does this verse change your approach?")
    elif "praise" in text or "worship" in topic.lower():
        prompts.insert(1, "Stop and name three specific things you can thank God for right now based on this verse.")
    elif "strength" in text:
        prompts.insert(1, "When was the last time you felt you ran out of your own strength? How did God meet you there?")
    elif "forgive" in text or "grace" in topic.lower():
        prompts.insert(1, "Is there guilt you're carrying that this verse says you can finally let go of?")
    else:
        prompts.insert(1, f"If you truly lived this verse out perfectly tomorrow, how would your day look different?")

    return prompts[:3]

formatted_cards = []
for i, v in enumerate(verses):
    formatted_cards.append({
        "id": i + 1,
        "verse": v["text"],
        "reference": v["ref"],
        "topic": v["topic"],
        "prompts": get_prompts(v)
    })

# Absolute path for the output file
output_path = os.path.abspath("resources/data/cards.json")

with open(output_path, "w") as f:
    json.dump(formatted_cards, f, indent=4)

print(f"Generated {len(formatted_cards)} cards with refined prompts at {output_path}")

