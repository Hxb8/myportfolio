---
title: How I Turned a Half-Finished Signup Form Into an Account Takeover
description: A few weeks ago I was poking around the signup flow on a private bug bounty target (calling it `redacted.com` here). Most signup flows are boring — email, OTP, password, done. This one had an extra step after OTP verification, and that extra step is where things got interesting.
date: '2026-05-27'
categories:
    - Bug bounty
    - Business Logic
    - OTP Bypass
    
published: true
---
## Table of Contents

## The setup

The flow on `redacted.com/signup?goToCreate=1` goes like this:

1. You enter your email, name, and password.
2. You get an OTP in your inbox and verify it.
3. You're asked for one more thing — a phone number — before the account actually gets created.

That third step is the kind of thing most people don't even notice as a "step." It just feels like part of finishing signup. But from a security standpoint, it means there's a window where your email has already been verified, but your account doesn't exist yet. I wanted to know what was happening server-side during that window.

## The "wait, that shouldn't work" moment

My first instinct was: what if I just... started a second signup with the same email, from a different session?

So I did. I opened an incognito window, went to the same signup page, and typed in the email address I'd just verified moments earlier in my normal browser. I expected to get an OTP prompt again — that's the whole point of OTP, right? Verify ownership every time someone tries to claim that email.

Instead, nothing. No OTP screen. The app just let me continue straight to the phone number step, as if I'd already proven I owned that inbox. I hadn't. I just knew the email address.

I finished the flow with a password of my choosing and a throwaway phone number. The account got created.

## What that actually means

Here's the part that matters: in this scenario, **the attacker doesn't need access to the victim's email, device, or session at all.** They just need to know the victim's email address — something that's often public, guessable, or leaked elsewhere.

Play it out as a real attack:

- The **victim** starts signing up on `redacted.com` with their real email, picks a name and password, and verifies the OTP sent to their inbox. Then they get distracted — maybe their phone's not handy for the next step, maybe they close the tab to finish later.
- The **attacker**, watching for this (or just opportunistically trying common/leaked emails), opens their own session and enters that same email into the signup form.
- The server checks: "has this email been verified?" Yes. So it skips OTP and lets the attacker walk straight through to account creation.
- The **attacker** sets their own password, throws in any phone number, and finishes the signup. The account is now live, tied to the victim's email, with credentials only the attacker knows.
- The **victim** comes back to finish their signup and just gets an error — the account already exists. No explanation, no indication that someone else just took it over.

That's it. No phishing, no malware, no MITM. Just a race to finish a form first.

## Why this happens

The root issue is that OTP verification gets recorded against the **email address itself**, not against the specific session or token that performed it. Once any session verifies that email, the server treats the email as "verified" globally — so a second, completely unrelated session
